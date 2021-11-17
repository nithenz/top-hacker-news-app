import rootStore from './store';

export {rootStore} from './store';

/**
 * App redux's root state
 */
export type AppReduxState = ReturnType<typeof rootStore.getState>;
