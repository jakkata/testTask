import template from './Item.jade';
import EventEmitter from '../EventEmitter';

type StorageData = {
    children: string[],
    title:string
} 

class Item {
    id: string;
    children: Set<Item> = new Set();

    body: Element;
    addNode: Element;
    destroyNode:Element;
    containerNode:Element;
    _orderNumber: number;
    _title: ?string = null;
    emitter:EventEmitter = new EventEmitter();

    static __DESTROY_EVENT = 'destroy';

    static _getUniqId(): string {
        return  Date.now().toString();
    }

    static getFirstElementFromDOMString (domString: string): Element {
        const div = document.createElement('div');
        div.innerHTML = domString;
        return div.childNodes[0];
    }

    constructor ( id: ?string, orderNumber: number = 0 ) {
        this.id = id || Item._getUniqId();
        this._orderNumber = orderNumber;
        this._restore(this.id);
        this.save();
    }

    destroy(): void  {
        this.children.forEach(c => c.destroy());
        this.body.parentNode.removeChild(this.body);
        this.emit(Item.__DESTROY_EVENT, this);
        window.localStorage.removeItem(this.id);
    }

    add(item: Item, render: boolean = false): void {
        item.on(Item.__DESTROY_EVENT,this._onchilddestroy);
        this.children.add(item);
        this.save();
        if(render){
            item.render(this.containerNode);
        }
    }

    on(...args: any[]): void {
        this.emitter.on(...args);
    }

    emit(...args: any[]): void {
        this.emitter.emit(...args);
    }

    getTitle(): string {
        return this._title;
    }

    getTemplate(hash: Object): string {
        return template(hash);
    }

    render(container: Element): void {
        this.body
            = Item.getFirstElementFromDOMString(this.getTemplate({title:this.getTitle()}));

        this.setKeyNodes();
        this.delegateDOMEvents();
        container.appendChild(this.body);

        this.children
            .forEach(item => item.render(this.containerNode));

    }

    setKeyNodes(): void {
        this.addNode = this.body.querySelector('.add');
        this.destroyNode = this.body.querySelector('.destroy');
        this.containerNode = this.body.querySelector('.container');
    }

    _onaddpressed = () => {
        this.add(new Item(null, this.children.size), true);
    };

    _ondestroypressed = () => {
        this.destroy();
    };

    _onchilddestroy = child => {
        this.children.delete(child);
        this.save();
    };

    delegateDOMEvents(): void {
        this.addNode.addEventListener('click',this._onaddpressed);
        this.destroyNode.addEventListener('click',this._ondestroypressed);
    }
    _setDefault(): void {
        this._title = `child № ${this._orderNumber}`;
    }
    _restore(id: string): void {
        const jsonData = window.localStorage.getItem(id);
        
        if (!jsonData) {
            this._setDefault();
            return;
        }
        
        const data: ?StorageData = JSON.parse(jsonData);
        this._title = data.title;

        data.children
            .forEach(id => this.add(new Item(id)));
    }
    save(): void {
        const data: StorageData = {
            title: this.getTitle(),
            children: []
        };
        this.children
            .forEach(item => data.children.push(item.id));
        
        const jsonData = JSON.stringify(data);
        window.localStorage.setItem(this.id, jsonData);
    }
}

export default Item;