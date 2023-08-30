import { InjectionKey } from "vue";
import type { Ref } from "vue";

export const baseUrlKey = Symbol() as InjectionKey<string>;
export const locationKey = Symbol() as InjectionKey<Ref<string>>;
export const showLoginModalKey = Symbol() as InjectionKey<Ref<boolean>>;
export const tokenClientKey = Symbol() as InjectionKey<Ref<google.accounts.oauth2.TokenClient>>;
export const googleReadyKey = Symbol() as InjectionKey<Ref<boolean>>;
