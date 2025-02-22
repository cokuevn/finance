import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component'; // если не lazy loading

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },

  {
    path: 'client',
    loadChildren: () =>
      import('./features/client/client.routes').then((m) => m.CLIENT_ROUTES),
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
