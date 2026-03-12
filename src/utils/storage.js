// Local Storage utility for family tree data
const STORAGE_KEY = 'family_tree_data';

export const familyStorage = {
  // Get all family members
  getAllMembers: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Save all family members
  saveAllMembers: (members) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  },

  // Get a single member by ID
  getMember: (id) => {
    const members = familyStorage.getAllMembers();
    return members.find(member => member.id === id);
  },

  // Add a new member
  addMember: (member) => {
    const members = familyStorage.getAllMembers();
    members.push(member);
    familyStorage.saveAllMembers(members);
    return member;
  },

  // Update an existing member
  updateMember: (id, updates) => {
    const members = familyStorage.getAllMembers();
    const index = members.findIndex(member => member.id === id);
    if (index !== -1) {
      members[index] = { ...members[index], ...updates };
      familyStorage.saveAllMembers(members);
      return members[index];
    }
    return null;
  },

  // Delete a member
  deleteMember: (id) => {
    const members = familyStorage.getAllMembers();
    const filteredMembers = members.filter(member => member.id !== id);
    familyStorage.saveAllMembers(filteredMembers);
  },

  // Get children of a parent
  getChildren: (parentId) => {
    const members = familyStorage.getAllMembers();
    return members.filter(member => member.parent_id === parentId);
  },

  // Get spouse
  getSpouse: (spouseId) => {
    const members = familyStorage.getAllMembers();
    return members.find(member => member.id === spouseId);
  },

  // Calculate age from birth date
  calculateAge: (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  },

  // Get upcoming birthdays (next 30 days)
  getUpcomingBirthdays: () => {
    const members = familyStorage.getAllMembers();
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30);

    return members.filter(member => {
      if (!member.tarikh_lahir) return false;
      
      const birthDate = new Date(member.tarikh_lahir);
      const currentYearBirthday = new Date(
        today.getFullYear(),
        birthDate.getMonth(),
        birthDate.getDate()
      );

      // If birthday has already passed this year, check next year
      const birthday = currentYearBirthday < today
        ? new Date(today.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate())
        : currentYearBirthday;

      return birthday >= today && birthday <= nextMonth;
    }).sort((a, b) => {
      const dateA = new Date(a.tarikh_lahir);
      const dateB = new Date(b.tarikh_lahir);
      return (dateA.getMonth() * 100 + dateA.getDate()) - (dateB.getMonth() * 100 + dateB.getDate());
    });
  },

  // Get statistics
  getStatistics: () => {
    const members = familyStorage.getAllMembers();
    
    // Count by gender
    const lelakiCount = members.filter(m => m.jantina === 'Lelaki').length;
    const perempuanCount = members.filter(m => m.jantina === 'Perempuan').length;
    
    // Find unique generations (by counting depth)
    const findGenerationDepth = (memberId, depth = 0) => {
      const member = members.find(m => m.id === memberId);
      if (!member || !member.parent_id) return depth;
      return findGenerationDepth(member.parent_id, depth + 1);
    };
    
    const generations = new Set();
    members.forEach(member => {
      generations.add(findGenerationDepth(member.id));
    });
    
    // Find unique family branches (by root ancestors)
    const roots = members.filter(member => !member.parent_id);
    
    // Calculate age statistics
    const membersWithAge = members.filter(m => m.tarikh_lahir);
    let averageAge = 0;
    let oldestAge = 0;
    let youngestAge = 0;
    
    if (membersWithAge.length > 0) {
      const ages = membersWithAge.map(member => familyStorage.calculateAge(member.tarikh_lahir));
      averageAge = ages.reduce((sum, age) => sum + age, 0) / ages.length;
      oldestAge = Math.max(...ages);
      youngestAge = Math.min(...ages);
    }
    
    return {
      totalMembers: members.length,
      lelakiCount,
      perempuanCount,
      activeGenerations: generations.size,
      familyBranches: roots.length,
      averageAge,
      oldestAge,
      youngestAge
    };
  },

  // Generate unique ID
  generateId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
};

export default familyStorage;