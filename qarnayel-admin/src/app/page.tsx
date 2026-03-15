import { ADMIN_ROUTES } from '@/config/routes';
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect(ADMIN_ROUTES.DASHBOARD);
}
