import Header from "@/components/Header";
import CouponManager from "@/components/CouponManager";
import { coupons } from "@/lib/data";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto flex w-full max-w-[1440px] flex-col items-center px-4 pb-8 pt-8 sm:px-6 sm:pb-12 sm:pt-10 lg:px-8">
        {/* Presentación */}
        <section className="mb-8 w-full max-w-3xl text-center sm:mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Cuponera digital
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-text-muted sm:text-base">
            Crea descuentos, administra tus promociones y valida los cupones
            de tus clientes desde un solo lugar.
          </p>
        </section>

        {/* Aplicación */}
        <section
          className="w-full max-w-7xl"
          aria-label="Gestión de cupones de descuento"
        >
          <CouponManager initialCoupons={coupons} />
        </section>
      </main>
    </div>
  );
}