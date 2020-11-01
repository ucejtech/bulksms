import store from '@/store';
import { NavigationGuardNext, Route } from 'vue-router';

export const isAuthenticationRoute = (to: Route, from: Route, next: NavigationGuardNext) => {
  const authenticated = store.getters['auth/isAuthenticated'];
  if (!authenticated) {
    next();
  } else {
    next('/dashboard');
  }
};

export const isAuthenticated = (to: Route, from: Route, next: NavigationGuardNext) => {
  const authenticated = store.getters['auth/isAuthenticated'];
  if (authenticated) {
    next();
  } else {
    next('/');
  }
};
