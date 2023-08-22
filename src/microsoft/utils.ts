import { AccountInfo, AuthError, AuthenticationResult, InteractionStatus, InteractionType, PopupRequest, PublicClientApplication, RedirectRequest, SilentRequest } from "@azure/msal-browser";
import { getCurrentInstance, ref, Ref, toRefs, watch } from "vue";
import { graphConfig, loginRequest } from "./auth";

export type MsalContext = {
    instance: PublicClientApplication,
    accounts: Ref<AccountInfo[]>,
    inProgress: Ref<InteractionStatus>
}

export type MsalAuthenticationResult = {
    acquireToken: (requestOverride?: PopupRequest|RedirectRequest|SilentRequest) => Promise<void>;
    authResult: Ref<AuthenticationResult|null>;
    error: Ref<AuthError|null>;
    inProgress: Ref<boolean>;
}

export function useMsal(): MsalContext {
    const internalInstance = getCurrentInstance();
    if (!internalInstance) {
        throw "useMsal() cannot be called outside the setup() function of a component";
    }
    const { instance, accounts, inProgress} = toRefs(internalInstance.appContext.config.globalProperties.$msal);

    if (!instance || !accounts || !inProgress) {
        throw "Please install the msalPlugin";
    }

    if (inProgress.value === InteractionStatus.Startup) {
        instance.value.handleRedirectPromise().catch(() => {
            // Errors should be handled by listening to the LOGIN_FAILURE event
            return;
        });
    }

    return {
        instance: instance.value,
        accounts,
        inProgress
    }
}

export function useMsalAuthentication(): MsalAuthenticationResult {
    const { instance, inProgress } = useMsal();
    const interactionType = InteractionType.Popup;
    const request: PopupRequest|RedirectRequest|SilentRequest = loginRequest;

    const localInProgress = ref<boolean>(false);
    const authResult = ref<AuthenticationResult|null>(null);
    const error = ref<AuthError|null>(null);

    const acquireToken = async (requestOverride?: PopupRequest|RedirectRequest|SilentRequest) => {
        if (!localInProgress.value) {
            localInProgress.value = true;
            const tokenRequest = requestOverride || request;

            if (inProgress.value === InteractionStatus.Startup || inProgress.value === InteractionStatus.HandleRedirect) {
                try {
                    const response = await instance.handleRedirectPromise()
                    if (response) {
                        authResult.value = response;
                        error.value = null;
                        return;
                    }
                } catch (e) {
                    authResult.value = null;
                    error.value = e as AuthError;
                    return;
                };
            }

            try {
                const response = await instance.acquireTokenSilent(tokenRequest);
                authResult.value = response;
                error.value = null;
            } catch(e) {
                if (inProgress.value !== InteractionStatus.None) {
                    return;
                }

                if (interactionType === InteractionType.Popup) {
                    instance.loginPopup(tokenRequest).then((response) => {
                        authResult.value = response;
                        error.value = null;
                    }).catch((e) => {
                        error.value = e;
                        authResult.value = null;
                    });
                } else if (interactionType === InteractionType.Redirect) {
                    await instance.loginRedirect(tokenRequest).catch((e) => {
                        error.value = e;
                        authResult.value = null;
                    });
                }
            };
            localInProgress.value = false;
        }
    }

    const stopWatcher = watch(inProgress, () => {
        if (!authResult.value && !error.value) {
            acquireToken();
        } else {
            stopWatcher();
        }
    });

    acquireToken();

    return {
        acquireToken,
        authResult,
        error,
        inProgress: localInProgress
    }
}

export function isAuthenticated(): Ref<boolean> {
    const { accounts } = useMsal();
    const isAuthenticated = ref(accounts.value.length > 0);

    watch(accounts, () => {
        isAuthenticated.value = accounts.value.length > 0;
    });

    return isAuthenticated;
}
