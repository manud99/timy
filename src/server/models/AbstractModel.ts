import { toDto } from "../services/DomainConverter";

export abstract class AbstractModel<T extends IModel, U> {
    protected state: T;

    get id() {
        return this.state.id;
    }

    toJson(): U {
        return toDto<U>(this);
    }
}
