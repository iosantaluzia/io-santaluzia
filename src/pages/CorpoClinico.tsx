import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";

const CorpoClinico = () => {
  return (
    <div className="min-h-screen">
      <NavigationHeader showLogo={true} />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-medical-primary mb-8 text-center">
            Nosso Corpo Clínico
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8 text-center">
            Conheça os profissionais que cuidam da sua visão com excelência e dedicação.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Médico 1 */}
            <div className="bg-white rounded-2xl shadow-medium overflow-hidden">
              <img
                src="https://via.placeholder.com/400x300"
                alt="Dr(a). Nome do Médico"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-medical-primary mb-2">
                  Dr(a). Nome do Médico
                </h3>
                <p className="text-muted-foreground mb-3">
                  Especialidade: Oftalmologia Geral
                </p>
                <p className="text-sm text-gray-600">
                  CRM: 12345-CE
                </p>
              </div>
            </div>

            {/* Médico 2 */}
            <div className="bg-white rounded-2xl shadow-medium overflow-hidden">
              <img
                src="https://via.placeholder.com/400x300"
                alt="Dr(a). Nome do Médico"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-medical-primary mb-2">
                  Dr(a). Nome do Médico
                </h3>
                <p className="text-muted-foreground mb-3">
                  Especialidade: Retina e Vítreo
                </p>
                <p className="text-sm text-gray-600">
                  CRM: 67890-CE
                </p>
              </div>
            </div>

            {/* Médico 3 */}
            <div className="bg-white rounded-2xl shadow-medium overflow-hidden">
              <img
                src="https://via.placeholder.com/400x300"
                alt="Dr(a). Nome do Médico"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-medical-primary mb-2">
                  Dr(a). Nome do Médico
                </h3>
                <p className="text-muted-foreground mb-3">
                  Especialidade: Cirurgia Refrativa
                </p>
                <p className="text-sm text-gray-600">
                  CRM: 11223-CE
                </p>
              </div>
            </div>

            {/* Médico 4 */}
            <div className="bg-white rounded-2xl shadow-medium overflow-hidden">
              <img
                src="https://via.placeholder.com/400x300"
                alt="Dr(a). Nome do Médico"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-medical-primary mb-2">
                  Dr(a). Nome do Médico
                </h3>
                <p className="text-muted-foreground mb-3">
                  Especialidade: Glaucoma
                </p>
                <p className="text-sm text-gray-600">
                  CRM: 44556-CE
                </p>
              </div>
            </div>

            {/* Médico 5 */}
            <div className="bg-white rounded-2xl shadow-medium overflow-hidden">
              <img
                src="https://via.placeholder.com/400x300"
                alt="Dr(a). Nome do Médico"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-medical-primary mb-2">
                  Dr(a). Nome do Médico
                </h3>
                <p className="text-muted-foreground mb-3">
                  Especialidade: Plástica Ocular
                </p>
                <p className="text-sm text-gray-600">
                  CRM: 77889-CE
                </p>
              </div>
            </div>

            {/* Médico 6 */}
            <div className="bg-white rounded-2xl shadow-medium overflow-hidden">
              <img
                src="https://via.placeholder.com/400x300"
                alt="Dr(a). Nome do Médico"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-medical-primary mb-2">
                  Dr(a). Nome do Médico
                </h3>
                <p className="text-muted-foreground mb-3">
                  Especialidade: Oftalmopediatria
                </p>
                <p className="text-sm text-gray-600">
                  CRM: 99001-CE
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
};

export default CorpoClinico;
