
-- data kategori layanan
INSERT INTO "service_categories" (uuid, name, media_id, description)
VALUES 
('cd857da2-c3f3-49fa-95b0-5d83e3e363d7', 'Mekanikal', 1, 'Spesialis sistem mekanikal untuk proyek skala besar: bandara, apartemen mewah, kereta cepat, dan rumah sakit. Kami memastikan sistem HVAC, pompa, dan instalasi mekanik bekerja maksimal, aman, dan efisien, sesuai standar internasional.'),
('e3f2a4f1-68c9-4d71-b6f0-9b2b43a0b9e1', 'Elektrikal', 2, 'Menangani sistem kelistrikan kompleks untuk bandara, mall, rumah sakit, dan rumah hunian premium. Layanan kami menjamin keamanan, kestabilan, dan performa listrik optimal, untuk memenuhi kebutuhan proyek berskala besar.'),
('f2d8c9b3-7e1a-4d5c-9a0b-2c3f8d1e7b4a', 'Telekomunikasi', 3, 'Ahli jaringan dan komunikasi untuk proyek skala besar. Dari bandara hingga kereta cepat dan apartemen modern, kami menghadirkan solusi komunikasi handal, cepat, dan modern, memastikan semua sistem terhubung tanpa hambatan.'),
('a7b5d9c2-1e3f-4b7a-9c8d-5e6f7a1b2c3d', 'Sipil', 4, 'Konstruksi sipil dengan kualitas tertinggi untuk bandara, mall, rumah sakit, dan hunian premium. Pondasi, struktur, dan fasilitas dibangun dengan ketelitian tinggi, menjamin bangunan kuat, aman, dan tahan lama.')
ON CONFLICT (uuid) 
DO UPDATE SET
  name = EXCLUDED.name,
  media_id = EXCLUDED.media_id,
  description = EXCLUDED.description;



-- data seed initial projects
INSERT INTO "clients" (uuid, classification,name, media_id)
VALUES 
('xxx-c3f3-49fa-95b0-5d83e3e363d7', 'PT', 'Wijaya Karya', 5),
('xxx-68c9-4d71-b6f0-9b2b43a0b9e1', 'PT','Adhi Karya', 6),
('xxx-7e1a-4d5c-9a0b-2c3f8d1e7b4a', 'PT','Patra Badak Arun Solusi', 7),
('xxx-1e3f-4b7a-9c8d-5e6f7a1b2c3d', 'PT','PLN', 8),
('xxx-1e1f-4b7a-9c8d-5e6f7a1b2c3d', 'PT','INTI BANGUN SEJAHTERA', 9),
('xxx-1e2f-4b7a-9c8d-5e6f7a1b2c3d', 'PT','MITRA SETYA UTAMA', 10),
('xxx-1e4f-4b7a-9c8d-5e6f7a1b2c3d', 'PT','GUNUNG GAYA PERSADA', 11)
ON CONFLICT (name) 
DO UPDATE SET
  name = EXCLUDED.name


-- Projects
INSERT INTO projects (uuid, name, slug, location, description, start_date, end_date, year, po_price, status, clients_id, created_at)
VALUES
('a1b2c3d4-0001-0000-0000-000000000001', 'Proyek Transmisi 500 kV New Aur Duri - Peranap Paket -1 Jambi PONDASI PAD & CHIMNEY KELAS 6 ( Borepile)', 'proyek-transmisi-500kv-aur-duri', 'Jambi, Indonesia', 'Proyek ini merupakan pekerjaan pondasi PAD dan chimney kelas 6 (borepile) untuk Transmisi 500 kV New Aur Duri – Peranap Paket 1 yang berlokasi di Provinsi Jambi. Pekerjaan meliputi pembangunan pondasi struktur transmisi tegangan ekstra tinggi dengan sistem borepile, yang berfungsi sebagai penopang utama menara transmisi. Pelaksanaan proyek dilakukan dengan standar mutu tinggi untuk menjamin kestabilan struktur, ketepatan dimensi, dan ketahanan jangka panjang, serta mengikuti jadwal kerja yang ketat agar seluruh target dapat diselesaikan tepat waktu.', '2018-01-01', '2018-12-31', 2018, NULL, 'draft', 1, now());

INSERT INTO projects (uuid, name, slug, location, description, start_date, end_date, year, po_price, status, clients_id, created_at)
VALUES
('a1b2c3d4-0002-0000-0000-000000000002', 'Pekerjaan Pembangunan 9 unit rumah Type 36 Proyek Taman Dhika Batu Tulis - Bogor', 'proyek-taman-dhika-batu-tulis', 'Bogor, Indonesia', 'Proyek ini merupakan pekerjaan pembangunan kompleks rumah hunian tipe 36 yang berlokasi di Batu Tulis, Bogor. Pekerjaan meliputi pembangunan struktur utama serta instalasi pendukung untuk menciptakan lingkungan hunian yang nyaman, fungsional, dan sesuai dengan standar kualitas konstruksi modern.', '2017-01-01', '2017-12-31', 2017, NULL, 'draft', 2, now());

INSERT INTO projects (uuid, name, slug, location, description, start_date, end_date, year, po_price, status, clients_id, created_at)
VALUES
('a1b2c3d4-0003-0000-0000-000000000003', 'Pekerjaan pengadaan dan pemasangan Instalasi Listrik pada proyek pembangunan tol Soroja Bandung', 'proyek-tol-soroja-bandung', 'Jakarta, Indonesia', 'Proyek ini meliputi pekerjaan pengadaan dan pemasangan instalasi listrik pada pembangunan Jalan Tol Soreang – Pasir Koja (Soroja), Bandung. Ruang lingkup pekerjaan mencakup penyediaan material, pemasangan sistem kelistrikan utama dan penerangan, serta penyaluran daya untuk fasilitas tol, gerbang, dan area pendukung operasional. Pelaksanaan dilakukan dengan standar keselamatan dan mutu tinggi, memastikan sistem listrik berfungsi secara andal, efisien, dan aman untuk mendukung operasional jalan tol secara berkelanjutan dan tepat waktu.', '2017-01-01', '2017-12-31', 2017, NULL, 'draft', 3, now());

INSERT INTO projects (uuid, name, slug, location, description, start_date, end_date, year, po_price, status, clients_id, created_at)
VALUES
('a1b2c3d4-0004-0000-0000-000000000004', 'Penyambungan daya Listrik PLN di tower BTS BSD Serpong', 'proyek-bts-bsd-serpong', 'Tangerang Selatan, Indonesia', 'Proyek ini mencakup pekerjaan penyambungan daya listrik PLN pada menara BTS (Base Transceiver Station) yang berlokasi di BSD, Serpong. Lingkup pekerjaan meliputi koordinasi dengan pihak PLN, pemasangan instalasi kelistrikan dari sumber utama ke panel distribusi BTS, serta pengujian sistem untuk memastikan pasokan daya yang stabil, aman, dan sesuai standar teknis. Pekerjaan dilaksanakan dengan memperhatikan ketepatan waktu, keselamatan kerja, dan keandalan sistem guna mendukung operasional jaringan telekomunikasi secara optimal.', '2017-01-01', '2017-12-31', 2017, NULL, 'draft', 4, now());

INSERT INTO projects (uuid, name, slug, location, description, start_date, end_date, year, po_price, status, clients_id, created_at)
VALUES
('a1b2c3d4-0005-0000-0000-000000000005', 'Pekerjaan Mekanikal, Elektrikal dan Plumbing Pembangunan Gerbang Tol Bogor 2 Pada jalan Tol Jagorawi Baranangsiang', 'proyek-tol-bogor-2', 'Bogor, Indonesia', 'xxxxx', '2017-01-01', '2017-12-31', 2017, NULL, 'draft', 4, now());

INSERT INTO projects (uuid, name, slug, location, description, start_date, end_date, year, po_price, status, clients_id, created_at)
VALUES
('a1b2c3d4-0006-0000-0000-000000000006', 'Pekerjaan Jasa dan Material Elektikal Pemindahan Genset Universitas Pertamina', 'proyek-universitas-pertamina', 'Jakarta Selatan, Indonesia', 'xxxxx', '2016-01-01', '2016-12-31', 2016, NULL, 'draft', 14, now());

-- Projects categories
INSERT INTO project_categories (uuid, projects_id, service_categories_id)
VALUES
(gen_random_uuid(), 1, (FLOOR(RANDOM() * 4) + 1)::int),
(gen_random_uuid(), 2, (FLOOR(RANDOM() * 4) + 1)::int),
(gen_random_uuid(), 3, (FLOOR(RANDOM() * 4) + 1)::int),
(gen_random_uuid(), 4, (FLOOR(RANDOM() * 4) + 1)::int),
(gen_random_uuid(), 9, (FLOOR(RANDOM() * 4) + 1)::int),
(gen_random_uuid(), 10, (FLOOR(RANDOM() * 4) + 1)::int)

-- Projects project medias
INSERT INTO project_medias (uuid, projects_id, media_id, is_cover)
VALUES
  (gen_random_uuid(), 1, 1, true),
  (gen_random_uuid(), 1, 2, false),
  (gen_random_uuid(), 1, 3, false),
  (gen_random_uuid(), 1, 4, false),
  (gen_random_uuid(), 2, 5, false),
  (gen_random_uuid(), 2, 6, false),
  (gen_random_uuid(), 3, 7, false),
  (gen_random_uuid(), 3, 8, false),
  (gen_random_uuid(), 10, 10, false),
  (gen_random_uuid(), 10, 11, false),
  (gen_random_uuid(), 10, 12, false),
  (gen_random_uuid(), 10, 13, false)
ON CONFLICT (projects_id, media_id)
DO UPDATE SET
  is_cover = EXCLUDED.is_cover;