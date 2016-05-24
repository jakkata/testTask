import Item from  '../Item/Item'
import template from './ItemRoot.jade'

class  ItemRoot extends Item {
    constructor() {
        super('root');
        this.render(document.body);
    }
    getTitle(): string{
        return 'Root';
    }
    destroy(): void  {
        this.children.forEach(c => c.destroy());
    }
    getTemplate(hash: Object): string {
        return template(hash);
    }
}
export default ItemRoot;