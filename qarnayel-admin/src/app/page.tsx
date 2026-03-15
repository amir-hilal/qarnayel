import { redirect } from 'next/navigation';
import { ADMIN_ROUTES } from '@/config/routes';

export default function RootPage() {
  redirect(ADMIN_ROUTES.DASHBOARD);
}
