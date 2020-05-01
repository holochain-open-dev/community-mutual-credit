import { Router } from '@vaadin/router';

export function setupRouter(outlet: HTMLElement) {
  const router = new Router(outlet);

  router.setRoutes([
    { path: '/', redirect: '/login' },
    {
      path: '/login',
      component: 'hccm-login',
    },
    {
      path: '/home',
      component: 'hccm-home',
    },
  ]);

  return router;
}
