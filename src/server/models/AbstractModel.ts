import { toDto } from "../services/DomainConverter";

export abstract class AbstractModel<T extends IModel> {
    protected state: T;

    get id() {
        return this.state.id;
    }

    toJson() {
        return toDto<T>(this);
    }
}
