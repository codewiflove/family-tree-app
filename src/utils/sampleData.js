// Sample family data for testing
export const sampleFamilyData = [
  {
    id: "root-1",
    nama_penuh: "Ahmad bin Abdullah",
    jantina: "Lelaki",
    tarikh_lahir: "1960-05-15",
    no_telefon: "+60123456789",
    pekerjaan: "Pensyarah",
    lokasi: "Kuala Terengganu, Terengganu",
    gambar_profil_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    parent_id: null,
    spouse_id: "root-2"
  },
  {
    id: "root-2",
    nama_penuh: "Siti binti Hassan",
    jantina: "Perempuan",
    tarikh_lahir: "1965-08-22",
    no_telefon: "+60129876543",
    pekerjaan: "Guru",
    lokasi: "Kuala Terengganu, Terengganu",
    gambar_profil_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop",
    parent_id: null,
    spouse_id: "root-1"
  },
  {
    id: "child-1",
    nama_penuh: "Ali bin Ahmad",
    jantina: "Lelaki",
    tarikh_lahir: "1990-03-10",
    no_telefon: "+60131122334",
    pekerjaan: "Doktor",
    lokasi: "Kuala Lumpur",
    gambar_profil_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    parent_id: "root-1",
    spouse_id: "child-2"
  },
  {
    id: "child-2",
    nama_penuh: "Aishah binti Mohd",
    jantina: "Perempuan",
    tarikh_lahir: "1992-11-05",
    no_telefon: "+60132233445",
    pekerjaan: "Peguam",
    lokasi: "Kuala Lumpur",
    gambar_profil_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    parent_id: null,
    spouse_id: "child-1"
  },
  {
    id: "child-3",
    nama_penuh: "Sara binti Ahmad",
    jantina: "Perempuan",
    tarikh_lahir: "1995-07-18",
    no_telefon: "+60133344556",
    pekerjaan: "Arkitek",
    lokasi: "Penang",
    gambar_profil_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    parent_id: "root-1",
    spouse_id: null
  },
  {
    id: "grandchild-1",
    nama_penuh: "Amir bin Ali",
    jantina: "Lelaki",
    tarikh_lahir: "2018-12-25",
    no_telefon: null,
    pekerjaan: "Pelajar",
    lokasi: "Kuala Lumpur",
    gambar_profil_url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop",
    parent_id: "child-1",
    spouse_id: null
  }
];

// Function to load sample data
export const loadSampleData = () => {
  const existingData = localStorage.getItem('family_tree_data');
  if (!existingData || JSON.parse(existingData).length === 0) {
    localStorage.setItem('family_tree_data', JSON.stringify(sampleFamilyData));
    localStorage.setItem('family_tree_user_name', 'Cikgu Fadzlee');
    return true;
  }
  return false;
};

export default sampleFamilyData;