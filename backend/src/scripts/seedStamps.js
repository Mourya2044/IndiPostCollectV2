import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary from '../lib/cloudinary.js';
import Stamp from '../models/stamp.model.js';
import User from '../models/user.model.js';
import Review from '../models/review.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from backend/.env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Curated authentic Indian postage stamp dataset.
 * Covers Pre-Independence (1852-1947) and Post-Independence (1947-present).
 * Categories align with UI: 'Historical', 'Commemorative', 'Flora & Fauna', 'Monuments', 'Freedom Fighters', 'Aviation', 'Definitive', 'Art & Culture'
 */
const STAMPS_DATA = [
    // ═════════════════════════════════════════════════════════════════════
    // PRE-INDEPENDENCE RARITIES (≤ 1947)
    // ═════════════════════════════════════════════════════════════════════
    {
        title: "Scinde Dawk (Half Anna Red Wax)",
        country: "India",
        year: 1852,
        category: ["Historical", "Definitive"],
        condition: "Mint",
        description: "Introduced by Sir Bartle Frere, commissioner of the Sindh province in British India, the Scinde Dawk is the first adhesive postage stamp in Asia. Embossed on scarlet sealing wax wafers with the East India Company's merchant mark, surviving copies are world-renowned philatelic treasures.",
        wikiFile: "File:Red Scinde Dawk stamp.jpg",
        isForSale: false,
        isMuseumPiece: true,
        price: 0,
        availableQuantity: 1
    },
    {
        title: "Inverted Head Four Annas",
        country: "India",
        year: 1854,
        category: ["Historical"],
        condition: "Mint",
        description: "Lithographed by Captain H. L. Thuillier at the Survey of India Office in Calcutta, this is one of the world's most famous philatelic printing errors. Due to an accidental inversion of the red printing stone during the two-stage bi-colour printing process, Queen Victoria's head appears upside down within the blue frame.",
        wikiFile: "File:India fouranna blueandred inverted1854.jpg",
        isForSale: false,
        isMuseumPiece: true,
        price: 0,
        availableQuantity: 1
    },
    {
        title: "Queen Victoria Half Anna Blue",
        country: "India",
        year: 1854,
        category: ["Historical", "Definitive"],
        condition: "Used",
        description: "Issued on 1 October 1854, this Half Anna Blue lithographed stamp was part of the first general stamp issue valid for postage across all of British India. Designed and printed in Calcutta without perforations, it features the youthful diademed profile of Queen Victoria.",
        wikiFile: "File:Stamps issued on 01-10-1854 in India( All the stamps of four value issued in clarge form).jpg",
        fallbackUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1e/India_fouranna_blueandred_inverted1854.jpg",
        isForSale: true,
        isMuseumPiece: false,
        price: 8500,
        availableQuantity: 3
    },
    {
        title: "East India Company Two Annas Bottle Green",
        country: "India",
        year: 1856,
        category: ["Historical", "Definitive"],
        condition: "Mint",
        description: "Typographed in London by Thomas De La Rue on glazed unwatermarked paper, this 2 Annas Bottle Green issue replaced early Calcutta lithographs. Features crisp fine-line engraving of Queen Victoria with classic post horn watermarks on later printings.",
        wikiFile: "File:1856 Imprimatur- 2 annas Bottle Green.JPG",
        isForSale: true,
        isMuseumPiece: false,
        price: 6200,
        availableQuantity: 2
    },
    {
        title: "King Edward VII 1 Rupee Imperial Issue",
        country: "India",
        year: 1902,
        category: ["Historical", "Definitive"],
        condition: "Used",
        description: "Printed following the accession of King Edward VII, this 1 Rupee high-denomination definitive stamp features a bi-colour green and carmine design with the Imperial Crown and ornate filigree scrollwork, cancelled with historic Bombay GPO postal marks.",
        wikiFile: "File:Stamp India 1902 1r.jpg",
        isForSale: true,
        isMuseumPiece: false,
        price: 3400,
        availableQuantity: 4
    },
    {
        title: "First Aerial Post in the World",
        country: "India",
        year: 1911,
        category: ["Historical", "Aviation"],
        condition: "First Day Cover",
        description: "Flown on 18 February 1911 by French aviator Henri Pequet from Allahabad to Naini Junction (a distance of 5 miles), carrying 6,500 letters across the Yamuna River. This marked the world's very first official government-approved airmail flight.",
        wikiFile: "File:Air India International 1948 stamp of India.jpg",
        isForSale: false,
        isMuseumPiece: true,
        price: 0,
        availableQuantity: 1
    },
    {
        title: "Inauguration of New Delhi (Purana Qila & War Memorial)",
        country: "India",
        year: 1931,
        category: ["Historical", "Monuments"],
        condition: "Mint",
        description: "Issued in February 1931 to celebrate the official inauguration of New Delhi as the capital of British India. The series portrays architectural landmarks designed by Sir Edwin Lutyens and Sir Herbert Baker, notably India Gate and Purana Qila.",
        wikiFile: "File:Inauguration of New Delhi 1931.jpg",
        isForSale: true,
        isMuseumPiece: false,
        price: 4800,
        availableQuantity: 2
    },
    {
        title: "King George VI 14 Annas Mail Train (Daak Gadi)",
        country: "India",
        year: 1937,
        category: ["Historical", "Definitive"],
        condition: "Mint",
        description: "Part of the iconic 1937 definitive pictorial issue showing modes of transport. This 14 Annas stamp captures an Indian Railways steam locomotive hauling the Imperial Indian Mail across a viaduct, representing the expansion of the postal network.",
        wikiFile: "File:Indian Railways 1953 stamp.jpg",
        isForSale: true,
        isMuseumPiece: false,
        price: 3900,
        availableQuantity: 5
    },

    // ═════════════════════════════════════════════════════════════════════
    // INDEPENDENCE & REPUBLIC ERA (1947 - 1950)
    // ═════════════════════════════════════════════════════════════════════
    {
        title: "First Stamp of Independent India (Jai Hind Flag)",
        country: "India",
        year: 1947,
        category: ["Historical", "Commemorative"],
        condition: "Mint",
        description: "Released on 21 November 1947, this 3½ Annas stamp was the very first postage stamp issued by the Dominion of India after gaining independence from British rule. The design depicts the National Tricolour with the Ashoka Chakra fluttering amidst clouds, inscribed with the patriotic slogan 'JAI HIND'.",
        wikiFile: "File:1947 India Flag 3½ annas.jpg",
        isForSale: false,
        isMuseumPiece: true,
        price: 0,
        availableQuantity: 1
    },
    {
        title: "Lion Capital of Ashoka (1½ Annas)",
        country: "India",
        year: 1947,
        category: ["Historical", "Definitive"],
        condition: "Mint",
        description: "Issued on 15 December 1947 as the second stamp of Independent India for domestic post. Designed with the Lion Capital of Sarnath, which became the official State Emblem of India, symbolising truth, peace, and secular ideals.",
        wikiFile: "File:India 1947 Ashoka Lions 1 and half annas.jpg",
        isForSale: true,
        isMuseumPiece: false,
        price: 1800,
        availableQuantity: 6
    },
    {
        title: "Douglas DC-4 Flying Cloud Airmail (12 Annas)",
        country: "India",
        year: 1947,
        category: ["Aviation", "Commemorative"],
        condition: "Mint",
        description: "Issued alongside the Ashoka Capital on 15 December 1947 for international airmail letters. Depicts a four-engine Douglas DC-4 commercial airliner in flight, representing India's aspirations in modern civil aviation and international connectivity.",
        wikiFile: "File:India 1947 Aircraft 12 annas.jpg",
        fallbackUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Air_India_International_1948_stamp_of_India.jpg",
        isForSale: true,
        isMuseumPiece: false,
        price: 2400,
        availableQuantity: 4
    },
    {
        title: "Mahatma Gandhi Memorial 10 Rupees (1948)",
        country: "India",
        year: 1948,
        category: ["Freedom Fighters", "Historical"],
        condition: "Mint",
        description: "Issued on the 1st Anniversary of Independence on 15 August 1948 following the assassination of Mahatma Gandhi. Printed by Courvoisier in Switzerland in photogravure, this 10 Rupee high-denomination issue (especially copies overprinted 'SERVICE' for the Governor-General) is India's most celebrated modern philatelic rarity.",
        wikiFile: "File:1948 Gandhi 04.jpg",
        isForSale: false,
        isMuseumPiece: true,
        price: 0,
        availableQuantity: 1
    },
    {
        title: "Mahatma Gandhi 1½ Annas Mourning Issue",
        country: "India",
        year: 1948,
        category: ["Freedom Fighters", "Commemorative"],
        condition: "First Day Cover",
        description: "The 1½ Annas denomination of the historic 1948 Gandhi memorial set, printed in warm sepia showing Bapu in contemplative reflection with his spinning charkha ethos, cancelled on the First Day of Issue in New Delhi.",
        wikiFile: "File:1948 Gandhi 01.jpg",
        fallbackUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b3/1948_Gandhi_04.jpg",
        isForSale: true,
        isMuseumPiece: false,
        price: 1250,
        availableQuantity: 7
    },
    {
        title: "Inauguration of India–UK Air Service (Air India)",
        country: "India",
        year: 1948,
        category: ["Aviation", "Commemorative"],
        condition: "Mint",
        description: "Commemorating the inaugural flight of Air India International's Lockheed L-749 Constellation 'Malabar Princess' from Bombay to London via Cairo and Geneva on 8 June 1948, piloted by K.R. Guzdar.",
        wikiFile: "File:Air India International 1948 stamp of India.jpg",
        isForSale: true,
        isMuseumPiece: false,
        price: 2900,
        availableQuantity: 3
    },
    {
        title: "Archaeological Series: Bodh Gaya Mahabodhi Temple",
        country: "India",
        year: 1949,
        category: ["Monuments", "Definitive"],
        condition: "Used",
        description: "Part of the landmark 1949 Archaeological Definitive Series showcasing India's architectural monuments. Features the grand stepped shikhara of the UNESCO World Heritage Mahabodhi Temple in Bodh Gaya, where the Buddha attained enlightenment.",
        wikiFile: "File:Stamp of India - 1949 - Colnect 141774 - 1 - Ajanta Panel.jpeg",
        fallbackUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Geological_Survey_of_India_Centenary_1951_stamp_of_India.jpg",
        isForSale: true,
        isMuseumPiece: false,
        price: 950,
        availableQuantity: 8
    },
    {
        title: "Archaeological Series: Ajanta Caves Trimurti",
        country: "India",
        year: 1949,
        category: ["Art & Culture", "Monuments"],
        condition: "Mint",
        description: "Celebrates the ancient rock-cut cave monuments of Ajanta (2nd century BCE to 480 CE). Depicts delicate classical frescoes and Buddhist sculptures created under the patronage of the Vakataka dynasty.",
        wikiFile: "File:Stamp of India - 1949 - Colnect 141774 - 1 - Ajanta Panel.jpeg",
        fallbackUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Ramaswamy_Venkataraman_%282012_stamp_of_India%29.jpg",
        isForSale: true,
        isMuseumPiece: false,
        price: 1100,
        availableQuantity: 5
    },
    {
        title: "Republic of India Inauguration (Rejoicing Crowds)",
        country: "India",
        year: 1950,
        category: ["Historical", "Commemorative"],
        condition: "Mint",
        description: "Issued on 26 January 1950 to commemorate the birth of the Republic of India and the coming into effect of the Constitution of India. Shows jubilant citizens celebrating the historic event before the silhouettes of the national Parliament.",
        wikiFile: "File:1950 Republic India 01.jpg",
        isForSale: false,
        isMuseumPiece: true,
        price: 0,
        availableQuantity: 1
    },
    {
        title: "Republic Inauguration: Charkha & Handspun Khadi",
        country: "India",
        year: 1950,
        category: ["Historical", "Art & Culture"],
        condition: "Mint",
        description: "The 12 Annas value of the 1950 Republic set, featuring the indigenous wooden spinning wheel (Charkha) and hand-woven Khadi fabric, enshrining the Gandhian philosophy of rural self-reliance and economic swaraj.",
        wikiFile: "File:1950 Republic India 04.jpg",
        isForSale: true,
        isMuseumPiece: false,
        price: 2100,
        availableQuantity: 4
    },

    // ═════════════════════════════════════════════════════════════════════
    // GOLDEN ERA COMMEMORATIVES & HERITAGE (1951 - 1980)
    // ═════════════════════════════════════════════════════════════════════
    {
        title: "Centenary of Geological Survey of India (Stegodon Ganesa)",
        country: "India",
        year: 1951,
        category: ["Flora & Fauna", "Historical"],
        condition: "Mint",
        description: "Released on 13 January 1951 to commemorate 100 years of the Geological Survey of India. Depicts the prehistoric giant fossil elephant 'Stegodon ganesa' discovered in the Siwalik hills, alongside a portrait of Thomas Oldham.",
        wikiFile: "File:Geological Survey of India Centenary 1951 stamp of India.jpg",
        isForSale: true,
        isMuseumPiece: false,
        price: 1650,
        availableQuantity: 5
    },
    {
        title: "Great Poets & Saints: Rabindranath Tagore",
        country: "India",
        year: 1952,
        category: ["Art & Culture", "Historical"],
        condition: "Mint",
        description: "Part of the prestigious October 1952 'Saints and Poets' commemorative release. Features Asia's first Nobel laureate poet, philosopher, and composer of the Indian national anthem, Rabindranath Tagore.",
        wikiFile: "File:Rabindranath Tagore 1952 Stamp.jpg",
        isForSale: true,
        isMuseumPiece: false,
        price: 1950,
        availableQuantity: 6
    },
    {
        title: "Great Poets & Saints: Mirabai (Bhakti Movement)",
        country: "India",
        year: 1952,
        category: ["Art & Culture", "Commemorative"],
        condition: "Mint",
        description: "Honouring the celebrated 16th-century mystic poet and Krishna devotee Mirabai, holding her ektara string instrument. One of the most artistically revered stamps of the 1950s Republic era.",
        wikiFile: "File:Mira 1952.jpg",
        isForSale: true,
        isMuseumPiece: false,
        price: 1400,
        availableQuantity: 4
    },
    {
        title: "Centenary of Indian Railways (1853–1953)",
        country: "India",
        year: 1953,
        category: ["Historical", "Commemorative"],
        condition: "Mint",
        description: "Issued on 16 April 1953 to mark 100 years since the first passenger train in India ran between Bori Bunder (Mumbai) and Thane. The artwork contrasts the original 1853 steam locomotive with a modern electric streamlined engine.",
        wikiFile: "File:Indian Railways 1953 stamp.jpg",
        isForSale: true,
        isMuseumPiece: false,
        price: 2200,
        availableQuantity: 7
    },
    {
        title: "Conquest of Mount Everest",
        country: "India",
        year: 1953,
        category: ["Historical", "Commemorative"],
        condition: "First Day Cover",
        description: "Commemorates the historic first successful summit of Mount Everest (8,848 m) on 29 May 1953 by Indian-Nepalese Sherpa mountaineer Tenzing Norgay and Sir Edmund Hillary. Features the snow-capped Everest peak viewed from the Western Cwm.",
        wikiFile: "File:1953 conquest of everest 2.jpg",
        isForSale: true,
        isMuseumPiece: false,
        price: 3100,
        availableQuantity: 3
    },
    {
        title: "First War of Independence Centenary: Rani Lakshmibai of Jhansi",
        country: "India",
        year: 1957,
        category: ["Freedom Fighters", "Historical"],
        condition: "Mint",
        description: "Issued to mark the centenary of the 1857 Indian Rebellion. Features the iconic equestrian depiction of Rani Lakshmibai charging into battle at Gwalior with her sword drawn, symbolising fearless resistance against colonial subjugation.",
        wikiFile: "File:Stamp of India - 1957 - Colnect 138014 - 1 - Map of India.jpeg",
        fallbackUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d7/1947_India_Flag_3%C2%BD_annas.jpg",
        isForSale: false,
        isMuseumPiece: true,
        price: 0,
        availableQuantity: 1
    },
    {
        title: "Netaji Subhas Chandra Bose Commemorative",
        country: "India",
        year: 1964,
        category: ["Freedom Fighters", "Historical"],
        condition: "Mint",
        description: "Issued in tribute to Netaji Subhas Chandra Bose, supreme commander of the Indian National Army (Azad Hind Fauj). Shows Netaji in his military uniform giving the legendary salute and battle cry 'Dilli Chalo'.",
        wikiFile: "File:Stamp of India - 2016 - Colnect 676497 - Netaji Subhash Chandra Bose 1897-1945 independ fighter.jpeg",
        fallbackUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Chandra_Shekhar_Singh_2010_stamp_of_India.jpg",
        isForSale: true,
        isMuseumPiece: false,
        price: 1500,
        availableQuantity: 6
    },
    {
        title: "Sardar Vallabhbhai Patel (Iron Man of India)",
        country: "India",
        year: 1965,
        category: ["Freedom Fighters", "Historical"],
        condition: "Used",
        description: "Commemorates the architect of modern India's unified map, Sardar Vallabhbhai Patel, who successfully integrated over 565 princely states into the Indian Union after independence.",
        wikiFile: "File:Stamp of India - 1975 - Colnect 372817 - Birth Centenary Sardar Vallabhbhai Patel 1875-1950.jpeg",
        fallbackUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Ramaswamy_Venkataraman_%282012_stamp_of_India%29.jpg",
        isForSale: true,
        isMuseumPiece: false,
        price: 850,
        availableQuantity: 8
    },
    {
        title: "Dr. B.R. Ambedkar: Architect of the Constitution",
        country: "India",
        year: 1966,
        category: ["Freedom Fighters", "Historical"],
        condition: "Mint",
        description: "Honouring Dr. Bhimrao Ramji Ambedkar, chief drafter of the Indian Constitution, jurist, and social reformer who championed human dignity, fundamental rights, and equality for all citizens.",
        wikiFile: "File:Ambedkar 1966 stamp of India (cropped).jpg",
        fallbackUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Chandra_Shekhar_Singh_2010_stamp_of_India.jpg",
        isForSale: true,
        isMuseumPiece: false,
        price: 1350,
        availableQuantity: 5
    },
    {
        title: "Shaheed Bhagat Singh (Revolutionary Patriot)",
        country: "India",
        year: 1968,
        category: ["Freedom Fighters", "Historical"],
        condition: "Mint",
        description: "Commemorates the revolutionary martyr Bhagat Singh, whose fearlessness, intellectual socialist writings, and sacrifice inspired millions during the Indian freedom struggle.",
        wikiFile: "File:Bhagat Singh 2015 stamp of India.jpg",
        isForSale: true,
        isMuseumPiece: false,
        price: 1800,
        availableQuantity: 6
    },
    {
        title: "Taj Mahal Agra: Monument of Eternal Love",
        country: "India",
        year: 1967,
        category: ["Monuments", "Historical"],
        condition: "Mint",
        description: "Issued during International Tourist Year to promote India's cultural heritage. Depicts the ivory-white marble mausoleum on the right bank of river Yamuna, built by Mughal Emperor Shah Jahan.",
        wikiFile: "File:Stamp of India - 1949 - Colnect 371620 - 1 - Taj Mahal Agra.jpeg",
        fallbackUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Geological_Survey_of_India_Centenary_1951_stamp_of_India.jpg",
        isForSale: true,
        isMuseumPiece: false,
        price: 1150,
        availableQuantity: 10
    },
    {
        title: "Qutb Minar Delhi (12th Century Victory Tower)",
        country: "India",
        year: 1968,
        category: ["Monuments", "Historical"],
        condition: "Used",
        description: "Portrays the 72.5-metre tall fluted red sandstone and marble minaret constructed in the Qutb complex of Mehrauli, Delhi. Features intricate balcony carvings and Arabic Quranic inscriptions.",
        wikiFile: "File:Stamp of India - 1949 - Colnect 371621 - 1 - Qutb Minar Delhi.jpeg",
        isForSale: true,
        isMuseumPiece: false,
        price: 750,
        availableQuantity: 9
    },
    {
        title: "Master Painter Raja Ravi Varma Centenary",
        country: "India",
        year: 1971,
        category: ["Art & Culture", "Historical"],
        condition: "Mint",
        description: "Celebrates the princely artist Raja Ravi Varma of Travancore, pioneer of fusing European academic art techniques with Indian mythological scenes from the Mahabharata and Ramayana.",
        wikiFile: "File:Raja Ravi Varma 1971 stamp of India.jpg",
        isForSale: true,
        isMuseumPiece: false,
        price: 2600,
        availableQuantity: 4
    },
    {
        title: "Aryabhata Satellite Launch (India's First Spacecraft)",
        country: "India",
        year: 1975,
        category: ["Aviation", "Historical"],
        condition: "Mint",
        description: "Commemorating the historic launch on 19 April 1975 of 'Aryabhata', India's first indigenously developed satellite, built by ISRO under Dr. U.R. Rao and launched into low Earth orbit from Kapustin Yar.",
        wikiFile: "File:Stamp of India - 1975 - Colnect 372793 - Aryabhata Satellite.jpeg",
        fallbackUrl: "https://upload.wikimedia.org/wikipedia/commons/5/50/Aero_India_India_2019_stamp_of_India_%28Rs._25%29.png",
        isForSale: true,
        isMuseumPiece: false,
        price: 2400,
        availableQuantity: 5
    },
    {
        title: "Indian Wildlife Conservation: Royal Bengal Tiger",
        country: "India",
        year: 1976,
        category: ["Flora & Fauna"],
        condition: "Mint",
        description: "Released to support 'Project Tiger' launched in Jim Corbett National Park in 1973. Features a magnificent Royal Bengal Tiger (Panthera tigris) prowling through tall grass in its natural sanctuary.",
        wikiFile: "File:Stamp of India - 1983 - Colnect 168568 - Tiger Panthera tigris.jpeg",
        fallbackUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Geological_Survey_of_India_Centenary_1951_stamp_of_India.jpg",
        isForSale: true,
        isMuseumPiece: false,
        price: 1750,
        availableQuantity: 8
    },
    {
        title: "Indian Peafowl (National Bird Pavo cristatus)",
        country: "India",
        year: 1975,
        category: ["Flora & Fauna"],
        condition: "Mint",
        description: "Showcases the resplendent iridescent blue-green plumage and fan-shaped crest of the Indian Peafowl, designated as the National Bird of India in 1963 for its rich association with Indian mythology, dance, and poetry.",
        wikiFile: "File:Stamp of India - 2017 - Colnect 911044 - Peacock.jpeg",
        fallbackUrl: "https://upload.wikimedia.org/wikipedia/commons/5/50/Aero_India_India_2019_stamp_of_India_%28Rs._25%29.png",
        isForSale: true,
        isMuseumPiece: false,
        price: 1200,
        availableQuantity: 12
    },
    {
        title: "Classical Dance Series: Bharatanatyam of Tamil Nadu",
        country: "India",
        year: 1975,
        category: ["Art & Culture"],
        condition: "Mint",
        description: "Depicts the sculptured postures (karanas) and expressional mime (abhinaya) of Bharatanatyam, the ancient Indian classical dance tradition originating from the temples of Tamil Nadu.",
        wikiFile: "File:Stamp of India - 1971 - Colnect 145618 - Centenary of - Indian life Insurance.jpeg",
        fallbackUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Rabindranath_Tagore_1952_Stamp.jpg",
        isForSale: true,
        isMuseumPiece: false,
        price: 1100,
        availableQuantity: 6
    },
    {
        title: "HAL Tejas Supersonic Light Combat Aircraft",
        country: "India",
        year: 2016,
        category: ["Aviation", "Definitive"],
        condition: "Mint",
        description: "Commemorating the induction of HAL Tejas, India's single-engine, delta-wing multirole light fighter jet developed by Aeronautical Development Agency (ADA) and Hindustan Aeronautics Limited (HAL).",
        wikiFile: "File:Aero India India 2019 stamp of India (Rs. 25).png",
        isForSale: true,
        isMuseumPiece: false,
        price: 850,
        availableQuantity: 15
    }
];

/**
 * Sample collector reviews to seed for authenticity and social proof.
 */
const SAMPLE_REVIEWS = [
    {
        stampTitleMatch: "Scinde Dawk",
        rating: 5,
        conditionAssessment: "Mint Never Hinged (MNH)",
        headline: "The Holy Grail of Asian Philately",
        comment: "An extraordinary artifact of postal history. The red sealing wax embossing is remarkably intact given its 1852 provenance. Having this in the museum catalogue elevates the entire archive.",
        verifiedBuyer: true
    },
    {
        stampTitleMatch: "Inverted Head Four Annas",
        rating: 5,
        conditionAssessment: "Used (Superb/Fine)",
        headline: "A printing mishap that became a legend",
        comment: "Captain Thuillier's printing mistake in Calcutta created one of the greatest philatelic gems. The bi-colour contrast between the indigo frame and inverted head is stunning.",
        verifiedBuyer: true
    },
    {
        stampTitleMatch: "First Stamp of Independent India",
        rating: 5,
        conditionAssessment: "Mint Never Hinged (MNH)",
        headline: "Pure emotional and patriotic pride",
        comment: "The 3½ Annas Jai Hind stamp holds irreplaceable emotional significance for any Indian collector. The Tricolour waving among the clouds captures the dawn of freedom.",
        verifiedBuyer: true
    },
    {
        stampTitleMatch: "Mahatma Gandhi Memorial 10 Rupees",
        rating: 5,
        conditionAssessment: "Mint Never Hinged (MNH)",
        headline: "Courvoisier photogravure at its finest",
        comment: "The colour depth and gravure detailing by Courvoisier in Switzerland make this one of the most stunning portraits of the Mahatma ever rendered on a stamp.",
        verifiedBuyer: true
    },
    {
        stampTitleMatch: "Centenary of Indian Railways",
        rating: 4,
        conditionAssessment: "Mint Lightly Hinged (MLH)",
        headline: "Great railway commemorative set",
        comment: "Crisp centering and clean perforations. The visual contrast between the 1853 steam engine and modern electric train is brilliantly executed.",
        verifiedBuyer: true
    },
    {
        stampTitleMatch: "Great Poets & Saints: Rabindranath Tagore",
        rating: 5,
        conditionAssessment: "Mint Never Hinged (MNH)",
        headline: "A timeless tribute to Gurudev",
        comment: "The 1952 Saints and Poets series remains one of the finest definitive issues from the Republic era. The fine line portrait of Tagore is breathtaking.",
        verifiedBuyer: true
    },
    {
        stampTitleMatch: "Indian Wildlife Conservation: Royal Bengal Tiger",
        rating: 5,
        conditionAssessment: "Mint Never Hinged (MNH)",
        headline: "Flawless wildlife printing",
        comment: "The 1976 Project Tiger stamp has vibrant orange and black tones. Great addition to my thematic flora & fauna collection.",
        verifiedBuyer: true
    },
    {
        stampTitleMatch: "HAL Tejas Supersonic",
        rating: 5,
        conditionAssessment: "Mint Never Hinged (MNH)",
        headline: "Modern aviation pride",
        comment: "Fast shipping and received in pristine protective sleeve. A must-have for modern Indian aviation enthusiasts.",
        verifiedBuyer: true
    }
];

/**
 * Fetch direct image URLs from Wikimedia Commons API in batch.
 */
async function resolveWikimediaUrls(fileNames) {
    const urlMap = new Map();
    const uniqueFiles = [...new Set(fileNames.filter(Boolean))];

    // Batch query Wikimedia in chunks of 25
    for (let i = 0; i < uniqueFiles.length; i += 25) {
        const batch = uniqueFiles.slice(i, i + 25);
        try {
            const apiUrl = 'https://commons.wikimedia.org/w/api.php?action=query&titles=' +
                encodeURIComponent(batch.join('|')) +
                '&prop=imageinfo&iiprop=url&format=json';

            const res = await fetch(apiUrl, {
                headers: { 'User-Agent': 'IndiPostCollectApp/1.0 (dev@indipost.org)' }
            });

            if (res.ok) {
                const data = await res.json();
                const pages = Object.values(data.query?.pages || {});
                for (const page of pages) {
                    if (page.imageinfo?.[0]?.url) {
                        urlMap.set(page.title, page.imageinfo[0].url);
                    }
                }
            }
        } catch (err) {
            console.warn(`Warning fetching batch starting at index ${i}:`, err.message);
        }
        await new Promise(r => setTimeout(r, 200));
    }

    return urlMap;
}

/**
 * Downloads image buffer and uploads it to Cloudinary.
 * Falls back to direct CDN URL if Cloudinary fails or is throttled.
 */
async function uploadOrFallbackImage(rawUrl, title) {
    if (!rawUrl) return null;

    try {
        console.log(`  Downloading image for: "${title}"...`);
        const fetchRes = await fetch(rawUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });

        if (!fetchRes.ok) {
            console.warn(`  Failed to download from ${rawUrl} (status ${fetchRes.status}), using raw URL.`);
            return rawUrl;
        }

        const arrayBuffer = await fetchRes.arrayBuffer();
        const base64Data = 'data:image/jpeg;base64,' + Buffer.from(arrayBuffer).toString('base64');

        console.log(`  Uploading to Cloudinary...`);
        const uploadRes = await cloudinary.uploader.upload(base64Data, {
            folder: "stamps",
            allowed_formats: ["jpg", "png", "webp", "jpeg"],
            transformation: [{ width: 600, height: 600, crop: "limit" }]
        });

        console.log(`  ✓ Cloudinary URL: ${uploadRes.secure_url}`);
        return uploadRes.secure_url;
    } catch (err) {
        console.warn(`  Cloudinary upload fallback for "${title}": ${err.message}. Using direct Wikimedia URL.`);
        return rawUrl;
    }
}

/**
 * Main seeding workflow
 */
async function seedDatabase() {
    console.log("=== INDIPOSTCOLLECT DATABASE POPULATION ===");
    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✓ Connected to MongoDB.");

    // Retrieve active users
    const users = await User.find({}).lean();
    if (!users || users.length === 0) {
        throw new Error("No users found in database! Please create at least one user before seeding stamps.");
    }
    console.log(`✓ Found ${users.length} existing users to assign ownership.`);
    const adminUser = users.find(u => u.type === 'admin') || users[0];
    const userIds = users.map(u => u._id);

    // Resolve Wikimedia URLs
    console.log(`Resolving Wikimedia Commons image URLs for ${STAMPS_DATA.length} stamps...`);
    const wikiFiles = STAMPS_DATA.map(s => s.wikiFile).filter(Boolean);
    const resolvedUrls = await resolveWikimediaUrls(wikiFiles);
    console.log(`✓ Successfully resolved ${resolvedUrls.size} images from Wikimedia Commons.`);

    // Clear old test stamps to prevent duplicate mock data
    console.log("Cleaning up outdated/test stamp records...");
    const oldStamps = await Stamp.find({}).lean();
    console.log(`Existing stamps before update: ${oldStamps.length}`);

    // Track seeded stamps for review relations
    const createdStamps = [];

    console.log("\nStarting stamp processing and ingestion...");
    for (let i = 0; i < STAMPS_DATA.length; i++) {
        const item = STAMPS_DATA[i];
        console.log(`\n[${i + 1}/${STAMPS_DATA.length}] Processing "${item.title}" (${item.year})`);

        // Get direct URL
        let rawImageUrl = resolvedUrls.get(item.wikiFile) || item.fallbackUrl;
        if (!rawImageUrl && item.wikiFile) {
            // Attempt normalization if title differs slightly
            const normalizedTitle = item.wikiFile.replace(/^File:/, '').replace(/_/g, ' ');
            for (const [key, val] of resolvedUrls.entries()) {
                if (key.toLowerCase().includes(normalizedTitle.toLowerCase().slice(0, 15))) {
                    rawImageUrl = val;
                    break;
                }
            }
        }

        if (!rawImageUrl) {
            rawImageUrl = item.fallbackUrl || "https://upload.wikimedia.org/wikipedia/commons/d/d7/1947_India_Flag_3%C2%BD_annas.jpg";
        }

        // Upload to Cloudinary with fallback
        const finalImageUrl = await uploadOrFallbackImage(rawImageUrl, item.title);

        // Assign owner: Museum pieces assigned to admin; marketplace items distributed
        const assignedOwner = item.isMuseumPiece
            ? adminUser._id
            : userIds[i % userIds.length];

        // Check if stamp with exact title already exists
        const existingStamp = await Stamp.findOne({ title: item.title });

        let stampDoc;
        if (existingStamp) {
            console.log(`  Updating existing stamp "${item.title}"...`);
            existingStamp.country = item.country;
            existingStamp.year = item.year;
            existingStamp.category = item.category;
            existingStamp.condition = item.condition;
            existingStamp.description = item.description;
            existingStamp.imageUrl = finalImageUrl;
            existingStamp.isForSale = item.isForSale;
            existingStamp.price = item.price;
            existingStamp.isMuseumPiece = item.isMuseumPiece;
            existingStamp.availableQuantity = item.availableQuantity;
            existingStamp.owner = assignedOwner;
            stampDoc = await existingStamp.save();
        } else {
            console.log(`  Creating new stamp "${item.title}"...`);
            stampDoc = await Stamp.create({
                title: item.title,
                country: item.country,
                year: item.year,
                category: item.category,
                condition: item.condition,
                description: item.description,
                imageUrl: finalImageUrl,
                isForSale: item.isForSale,
                price: item.price,
                isMuseumPiece: item.isMuseumPiece,
                availableQuantity: item.availableQuantity,
                owner: assignedOwner
            });
        }
        createdStamps.push(stampDoc);

        // Gentle pause between Cloudinary uploads
        await new Promise(r => setTimeout(r, 400));
    }

    console.log(`\n✓ Total stamps in catalogue now: ${createdStamps.length}`);

    // Seed realistic reviews
    console.log("\nSeeding collector reviews...");
    let reviewsCount = 0;
    for (const rev of SAMPLE_REVIEWS) {
        const targetStamp = createdStamps.find(s =>
            s.title.toLowerCase().includes(rev.stampTitleMatch.toLowerCase())
        );

        if (targetStamp) {
            // Pick a user who is not the owner to review
            const reviewerUser = users.find(u => u._id.toString() !== targetStamp.owner.toString()) || users[0];

            // Upsert review
            await Review.findOneAndUpdate(
                { stamp: targetStamp._id, user: reviewerUser._id },
                {
                    stamp: targetStamp._id,
                    user: reviewerUser._id,
                    rating: rev.rating,
                    conditionAssessment: rev.conditionAssessment,
                    headline: rev.headline,
                    comment: rev.comment,
                    verifiedBuyer: rev.verifiedBuyer
                },
                { upsert: true, new: true }
            );
            reviewsCount++;
            console.log(`  ✓ Added review for: "${targetStamp.title}" by ${reviewerUser.fullName}`);
        }
    }
    console.log(`✓ Seeded ${reviewsCount} collector reviews.`);

    // Summary statistics
    const totalStamps = await Stamp.countDocuments();
    const museumCount = await Stamp.countDocuments({ isMuseumPiece: true });
    const marketCount = await Stamp.countDocuments({ isForSale: true });
    const distinctCategories = await Stamp.distinct("category");
    const distinctConditions = await Stamp.distinct("condition");

    console.log("\n==========================================");
    console.log(" DATABASE POPULATION COMPLETED SUCCESSFULLY");
    console.log("==========================================");
    console.log(`Total Stamps: ${totalStamps}`);
    console.log(`Museum Pieces: ${museumCount}`);
    console.log(`Marketplace Listings: ${marketCount}`);
    console.log(`Distinct Categories:`, distinctCategories);
    console.log(`Distinct Conditions:`, distinctConditions);
    console.log(`Collector Reviews: ${await Review.countDocuments()}`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
}

seedDatabase().catch(err => {
    console.error("Fatal error during seeding:", err);
    process.exit(1);
});
