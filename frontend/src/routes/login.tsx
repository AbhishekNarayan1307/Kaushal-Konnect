import { useState, useEffect } from 'react';
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { API_BASE_URL } from '@/lib/api';
import { toast } from 'sonner';

import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'worker') {
        navigate({ to: '/worker' });
      } else if (user.role === 'coop_manager') {
        navigate({ to: '/coop' });
      } else {
        navigate({ to: '/' });
      }
    }
  }, [user, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // FastAPI OAuth2 expects form data for login
      const formData = new FormData();

      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();

      console.log('Login data received:', data);

      // Update Auth State
      login(data.access_token, data.user);

      // Success feedback
      toast.success('Welcome back!');

      // Redirect based on role is handled in useEffect
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-2">

      {/* =====================================================
          LEFT SIDE - KAUSHAL KONNECT BRANDING
          ===================================================== */}

      <div className="relative hidden min-h-screen overflow-hidden bg-navy lg:flex lg:flex-col lg:justify-between">

        {/* Decorative circles */}
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold/10" />

        <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-gold/10" />


        {/* Logo / Brand */}
        <div className="relative z-10 p-12">

          <Link
            to="/"
            className="inline-flex items-center gap-3"
          >

            {/* YOUR LOGO */}
            <img
              src="/logo icon.png"
              alt="Kaushal-Konnect logo"
              className="h-14 w-14 object-contain"
            />

            <div>
              <p className="font-display text-xl font-bold text-white">
                Kaushal-Konnect
              </p>

              <p className="text-xs text-white/60">
                Connecting skills with opportunity
              </p>
            </div>

          </Link>

        </div>


        {/* Main Branding Content */}
        <div className="relative z-10 max-w-xl px-12 pb-20">

          {/* Small Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-4 py-2 text-sm text-gold">

            <Sparkles className="h-4 w-4" />

            Cooperative-powered services

          </div>


          {/* Main Heading */}
          <h1 className="font-display text-5xl font-bold leading-tight text-white xl:text-6xl">

            Skilled people.

            <br />

            <span className="text-gold">
              Trusted services.
            </span>

          </h1>


          {/* Description */}
          <p className="mt-6 max-w-lg text-base leading-7 text-white/65">

            Discover verified local workers, connect with trusted services,
            and create better opportunities through cooperative communities.

          </p>


          {/* Features */}
          <div className="mt-10 space-y-4">

            {/* Feature 1 */}
            <div className="flex items-center gap-3 text-white/80">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">

                <ShieldCheck className="h-5 w-5 text-gold" />

              </div>

              <span>
                Verified and trusted workers
              </span>

            </div>


            {/* Feature 2 */}
            <div className="flex items-center gap-3 text-white/80">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">

                <Sparkles className="h-5 w-5 text-gold" />

              </div>

              <span>
                Smart worker recommendations
              </span>

            </div>


            {/* Feature 3 */}
            <div className="flex items-center gap-3 text-white/80">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">

                <ShieldCheck className="h-5 w-5 text-gold" />

              </div>

              <span>
                Built around local cooperatives
              </span>

            </div>

          </div>

        </div>


        {/* Bottom Decorative Line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      </div>


      {/* =====================================================
          RIGHT SIDE - LOGIN FORM
          ===================================================== */}

      <div className="flex min-h-screen items-center justify-center px-6 py-12 lg:px-16">

        <div className="w-full max-w-md">


          {/* Mobile Logo */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">

            {/* YOUR LOGO */}
            <img
              src="/logo.png"
              alt="Kaushal-Konnect logo"
              className="h-14 w-14 object-contain"
            />

            <div>

              <p className="font-display text-xl font-bold">
                Kaushal-Konnect
              </p>

              <p className="text-xs text-muted-foreground">
                Connecting skills with opportunity
              </p>

            </div>

          </div>


          {/* Login Heading */}
          <div className="mb-8">

            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Welcome back
            </p>

            <h2 className="font-display text-4xl font-bold tracking-tight">
              Sign in to your account
            </h2>

            <p className="mt-3 text-muted-foreground">
              Access your services, bookings and cooperative dashboard.
            </p>

          </div>


          {/* =================================================
              LOGIN FORM
              ================================================= */}

          <form onSubmit={handleSubmit} className="space-y-6">


            {/* Email */}
            <div className="space-y-2">

              <Label htmlFor="email">
                Email address
              </Label>

              <div className="relative">

                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-xl pl-12"
                />

              </div>

            </div>


            {/* Password */}
            <div className="space-y-2">

              <Label htmlFor="password">
                Password
              </Label>

              <div className="relative">

                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 rounded-xl pl-12"
                />

              </div>

            </div>


            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full rounded-xl bg-gradient-gold font-semibold shadow-gold transition-transform hover:-translate-y-0.5"
            >

              {isLoading ? (
                'Logging in...'
              ) : (
                <span className="flex items-center justify-center gap-2">

                  Login

                  <ArrowRight className="h-4 w-4" />

                </span>
              )}

            </Button>

          </form>


          {/* Signup Link */}
          <div className="mt-8 text-center text-sm text-muted-foreground">

            Don't have an account?{' '}

            <Link
              to="/signup"
              className="font-semibold text-primary hover:underline"
            >
              Create an account
            </Link>

          </div>


          {/* Footer */}
          <p className="mt-12 text-center text-xs text-muted-foreground">

            By continuing, you agree to use Kaushal-Konnect responsibly.

          </p>

        </div>

      </div>

    </div>
  );
}
