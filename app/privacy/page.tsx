import type { Metadata } from "next";
import { StudioFooter } from "@/components/StudioFooter";
import { StudioHeader } from "@/components/StudioHeader";

export const metadata: Metadata = {
  title: "Política de privacidad · Lala's Ads Studio",
  description:
    "Cómo Lala's Pizza trata datos en su herramienta interna de anuncios Meta.",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-full flex-col bg-[#F5F0E6]">
      <StudioHeader current="/privacy" />
      <main className="mx-auto w-full max-w-3xl px-4 py-10">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[#C41E3A]">
          Legal
        </p>
        <h1 className="mt-2 font-serif text-3xl text-[#1A1A1A] sm:text-4xl">
          Política de privacidad
        </h1>
        <p className="mt-2 text-sm text-[#7a7268]">
          Última actualización: 10 de septiembre de 2026
        </p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-[#2D2D2D]">
          <section>
            <h2 className="font-serif text-xl text-[#1A1A1A]">Quiénes somos</h2>
            <p className="mt-2 text-[#5c564e]">
              Lala&apos;s Pizza (Uruguay) opera Lala&apos;s Ads Studio, una
              herramienta interna para que el equipo arme creatividades y
              campañas de Meta Ads. No es un producto público ni una app para
              clientes finales. Sitio de la marca:{" "}
              <a
                className="underline"
                href="https://lalaspizza.uy"
                rel="noreferrer"
              >
                lalaspizza.uy
              </a>
              . Contacto:{" "}
              <a className="underline" href="mailto:ventas@lalaspizza.uy">
                ventas@lalaspizza.uy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1A1A1A]">
              Qué datos tratamos
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[#5c564e]">
              <li>
                Credenciales de la cuenta publicitaria de Lala&apos;s: access
                token de Meta, Ad Account ID, Page ID e Instagram actor ID
                opcional.
              </li>
              <li>
                Contenido que el equipo carga o genera: briefs, copy, fotos de
                producto, nombres de campaña y logs de publicaciones en pausa.
              </li>
              <li>
                Métricas agregadas de Ads Manager (impresiones, clicks, spend,
                CTR) de los últimos 7 días, si la cuenta está conectada.
              </li>
              <li>
                Si hay una API key de copy (Anthropic, OpenAI o xAI), el brief
                y el texto generado se envían a ese proveedor para armar
                variantes.
              </li>
            </ul>
            <p className="mt-2 text-[#5c564e]">
              Esta herramienta no pide login de clientes, no recolecta datos de
              perfiles de personas que ven los anuncios y no vende bases de
              datos. Los anuncios se crean siempre en pausa; el gasto lo activa
              una persona en Ads Manager.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1A1A1A]">
              Cómo usamos los datos
            </h2>
            <p className="mt-2 text-[#5c564e]">
              Solo para operar publicidad de Lala&apos;s Pizza: generar copy,
              componer creatividades, exportar ZIP/CSV o crear campañas vía la
              Marketing API de Meta. No usamos los datos para otras marcas ni
              para publicidad propia del studio.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1A1A1A]">
              Con quién los compartimos
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[#5c564e]">
              <li>
                <strong>Meta Platforms</strong> (Facebook/Instagram), cuando el
                equipo conecta la cuenta o publica anuncios en pausa. Aplica la{" "}
                <a
                  className="underline"
                  href="https://www.facebook.com/privacy/policy"
                  rel="noreferrer"
                >
                  política de privacidad de Meta
                </a>{" "}
                y sus términos de la Marketing API.
              </li>
              <li>
                Proveedores de modelos de texto, solo si configuramos una API
                key.
              </li>
            </ul>
            <p className="mt-2 text-[#5c564e]">
              No vendemos datos personales. No compartimos el token de Meta
              fuera del equipo.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1A1A1A]">
              Dónde se guardan
            </h2>
            <p className="mt-2 text-[#5c564e]">
              En el uso actual, el token y los archivos locales (fotos, log de
              campañas) quedan en el equipo de quien opera el studio, no en un
              producto multi-tenant. Lo que se publica queda también en Ads
              Manager, bajo la cuenta de Lala&apos;s. Si más adelante
              hospedamos el studio en un servidor, los mismos tipos de dato se
              guardarán ahí, con acceso limitado al equipo.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1A1A1A]">
              Conservación y baja
            </h2>
            <p className="mt-2 text-[#5c564e]">
              El token local se puede borrar en Ajustes (“Borrar token local”).
              Las fotos y el historial se pueden eliminar del disco. Las
              campañas ya creadas en Meta se gestionan o se borran desde Ads
              Manager. No conservamos datos de usuarios de Facebook más allá de
              las métricas agregadas que Meta nos devuelve.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1A1A1A]">Derechos</h2>
            <p className="mt-2 text-[#5c564e]">
              Quien opera el studio puede pedir acceso, corrección o
              eliminación escribiendo a{" "}
              <a className="underline" href="mailto:ventas@lalaspizza.uy">
                ventas@lalaspizza.uy
              </a>
              . En Uruguay aplica la Ley 18.331. Para datos que viven en Meta,
              también se usan las herramientas de Facebook/Instagram.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1A1A1A]">
              Menores y cookies
            </h2>
            <p className="mt-2 text-[#5c564e]">
              El studio no está dirigido a menores de 18 años. No usamos
              cookies de seguimiento ni publicidad de terceros en esta
              herramienta.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1A1A1A]">Cambios</h2>
            <p className="mt-2 text-[#5c564e]">
              Si cambia cómo tratamos datos, actualizamos esta página y la
              fecha del encabezado.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1A1A1A]">
              Privacy policy (English)
            </h2>
            <p className="mt-2 text-[#5c564e]">
              Lala&apos;s Ads Studio is an internal tool used by Lala&apos;s
              Pizza (Uruguay) to draft and create paused Meta ads. It is not a
              consumer app. We store the business ad-account token and IDs on
              the operator&apos;s machine, plus ad copy, product photos and
              aggregate campaign metrics. We send creatives and campaign data
              to Meta when an operator publishes paused ads, and we may send
              copy briefs to an AI provider if an API key is configured. We do
              not sell personal data, do not collect end-customer Facebook
              profiles, and ads never go live without a human in Ads Manager.
              Contact: ventas@lalaspizza.uy. Website: https://lalaspizza.uy.
            </p>
          </section>
        </div>
      </main>
      <StudioFooter />
    </div>
  );
}
