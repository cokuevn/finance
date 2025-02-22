import { Routes } from '@angular/router';
import { ClientLayoutComponent } from './components/client-layout/client-layout.component';
import { ClientDashboardComponent } from './pages/client-dashboard/client-dashboard.component';

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    component: ClientLayoutComponent,
    children: [
      { path: '', component: ClientDashboardComponent },
      // { path: 'profile', component: ProfileComponent },
      // { path: 'payments', component: PaymentsComponent },
      // и т.д.
    ],
  },
];
