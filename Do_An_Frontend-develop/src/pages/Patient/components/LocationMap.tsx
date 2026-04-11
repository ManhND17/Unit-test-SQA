import { Skeleton } from '@mui/material';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';

const LocationMap = () => {
  const [loaded, setLoaded] = useState(false);
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Vị trí & Chỉ đường</h2>
      <div className="h-[400px] w-full rounded-xl overflow-hidden mb-6 border border-gray-200">
        {!loaded && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            animation="wave"
          />
        )}

        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.7273945988914!2d105.8280553759693!3d21.00356188864225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac7dc5bab827%3A0xc076d880a1dc5828!2zQuG7h25oIHZp4buHbiDEkOG6oWkgaOG7jWMgWSBIw6AgTuG7mWk!5e0!3m2!1svi!2s!4v1759474597444!5m2!1svi!2s"
          height="400"
          width="100%"
          style={{
            border: 'none',
            display: loaded ? 'block' : 'none',
          }}
          onLoad={() => setLoaded(true)}
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-4">
          <p className="mb-2">
            <strong>Địa chỉ:</strong> 123 Đường Sức Khỏe, Quận Y Tế, TP.HCM
          </p>
          <p>
            <strong>Hotline:</strong> 1900-1234
          </p>
        </div>
        <a
          href="https://maps.app.goo.gl/5BUHuLoAHt1UARKE7"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Lấy chỉ đường trên Google Maps
          <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </div>
    </section>
  );
};
export default LocationMap;
