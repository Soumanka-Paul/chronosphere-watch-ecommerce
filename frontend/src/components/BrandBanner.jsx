// Auto-scrolling brand name strip
// Shows all watch brands sliding left continuously

import AudemarsPiguet from '../assets/AudemarsPiguet.png'
import Breitling from '../assets/Brietling.webp'
import Cartier from '../assets/Cartier.png'
import HuBLOT from '../assets/HuBLOT.PNG'
import IWC from '../assets/IWC.png'
import JaegerLeCoultre from '../assets/JaegerLeCoultre.png'
import Omega from '../assets/Omega.png'
import PatekPhilippe from '../assets/PatekPhilippe.png'
import Rolex from '../assets/Rolex.png'
import TagHeuer from '../assets/TagHeuer.png'

const brands = [
  { name: 'Rolex',            img: Rolex           },
  { name: 'Omega',            img: Omega           },
  { name: 'Tag Heuer',        img: TagHeuer        },
  { name: 'Hublot',           img: HuBLOT          },
  { name: 'IWC',              img: IWC             },
  { name: 'Cartier',          img: Cartier         },
  { name: 'Breitling',        img: Breitling       },
  { name: 'Patek Philippe',   img: PatekPhilippe   },
  { name: 'Audemars Piguet',  img: AudemarsPiguet  },
  { name: 'Jaeger-LeCoultre', img: JaegerLeCoultre },
]

export default function BrandBanner() {
  return (
    <div className="bg-gray-50 py-12 overflow-hidden border-y border-gray-200 w-full relative">

      {/* Title */}
      <p
        className="text-center text-xs uppercase tracking-widest text-gray-400 mb-8"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Our Premium Brands
      </p>

      {/* Scrolling Strip */}
      <div className="flex overflow-hidden">
        <div className="flex gap-20 animate-scroll">

          {/* Render brands TWICE for seamless loop */}
          {[...brands, ...brands].map((brand, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-3 min-w-[140px]"
            >
              {/* ← bigger: h-20 w-32 instead of h-12 w-20 */}
              <img
                src={brand.img}
                alt={brand.name}
                className="h-20 w-32 object-contain grayscale hover:grayscale-0 transition-all duration-300"
              />
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {brand.name}
              </span>
            </div>
          ))}

        </div>
      </div>

    </div>
  )
}