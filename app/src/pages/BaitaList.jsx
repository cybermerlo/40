import { BAITE, IMAGES } from '../data/baite';
import { BaitaCard } from '../components/Baite';
import { Card } from '../components/Common';

const BaitaList = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Le Baite</h1>
        <p className="text-gray-600">
          Due baite accoglienti a pochi passi l'una dall'altra
        </p>
      </div>

      {/* Mappa */}
      <Card className="mb-8">
        <Card.Body className="p-0">
          <img
            src={IMAGES.mappaBaite}
            alt="Mappa delle baite"
            className="w-full h-auto rounded-xl"
          />
        </Card.Body>
        <Card.Footer className="text-center">
          <p className="text-sm text-gray-500">
            Le due baite distano circa 700 metri l'una dall'altra (~10 minuti a piedi)
          </p>
        </Card.Footer>
      </Card>

      {/* Baite */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <BaitaCard baitaId="A" />
        <BaitaCard baitaId="B" />
      </div>

      {/* Camminata */}
      <Card>
        <Card.Body className="p-0">
          <img
            src={IMAGES.camminata}
            alt="Camminata tra le baite"
            className="w-full h-64 object-cover rounded-t-xl"
          />
        </Card.Body>
        <Card.Body>
          <h3 className="font-bold text-gray-800 mb-2">Il percorso tra le baite</h3>
          <p className="text-gray-600">
            Una breve camminata nella neve collega le due baite. Perfetta per prendere 
            una boccata d'aria fresca tra un'attività e l'altra!
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BaitaList;
