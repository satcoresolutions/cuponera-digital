import Image from "next/image";
import CouponManager from "@/components/CouponManager";
import { coupons } from "@/lib/data";

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center sm:gap-8">
          {/* Identidad de SatCore Solutions */}
          <div className="flex flex-col items-start gap-3">
            <Image
              src="/logo.png"
              alt="SatCore Solutions"
              width={200}
              height={65}
              className="h-auto w-[160px] object-contain sm:w-[200px]"
              priority
            />

            <p className="max-w-xs text-sm text-ink-soft">
              Soluciones digitales seguras, accesibles y funcionales para todos.
            </p>
          </div>

          {/* Título y subtítulo de la aplicación */}
          <div className="sm:flex-1">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Cuponera digital
            </h1>

            <p className="mt-1 text-ink-soft">
              Crea descuentos y valida los cupones de tus clientes.
            </p>
          </div>
        </div>
      </header>

      <CouponManager initialCoupons={coupons} />
    </main>
  );
}