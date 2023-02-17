import { InjectionKey } from "vue";
import type { Ref } from "vue";

export const locationKey = Symbol() as InjectionKey<Ref<string>>;
