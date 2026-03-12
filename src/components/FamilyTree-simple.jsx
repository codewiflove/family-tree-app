import React, { useState } from 'react';
import { familyStorage } from '../utils/storage';
import MemberForm from './MemberForm';
import MemberCard from './MemberCard';

const FamilyTreeSimple = ({ members, onAddMember, onUpdateMember, onDeleteMember }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [relationshipType, setRelationshipType] = useState('child');

  // Get root members (those without parents)
  const rootMembers = members.filter(member => !member.parent_id);
  
  // Get children of a member
  const getChildren = (memberId) => {
    return members.filter(member => member.parent_id === memberId);
  };

  // Get spouse of a member
  const getSpouse = (memberId) => {
    return members.find(member => member.spouse_id === memberId);
  };

  // Render a member node
  const renderMemberNode = (member, depth = 0, renderedSpouses = new Set()) => {
    const children = getChildren(member.id);
    const spouse = getSpouse(member.id);
    
    // Add this member to rendered spouses to prevent infinite recursion
    const updatedRenderedSpouses = new Set(renderedSpouses);
    updatedRenderedSpouses.add(member.id);
    
    return (
      <div key={member.id} style={{ marginLeft: `${depth * 40}px`, marginBottom: '20px' }}>
        <div 
          className="directory-item"
          onClick={() => setSelectedMember(member)}
          style={{ cursor: 'pointer', background: selectedMember?.id === member.id ? 'rgba(255, 90, 95, 0.1)' : 'white' }}
        >
          <MemberCard 
            member={member}
            onUpdate={onUpdateMember}
            onDelete={onDeleteMember}
            compact={true}
          />
        </div>
        
        {/* Render spouse if exists AND not already rendered */}
        {spouse && !renderedSpouses.has(spouse.id) && (
          <div style={{ marginLeft: '20px', marginTop: '10px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--airbnb-light)', marginBottom: '5px' }}>Pasangan:</div>
            {renderMemberNode(spouse, depth, updatedRenderedSpouses)}
          </div>
        )}
        
        {/* Render children */}
        {children.length > 0 && (
          <div style={{ marginLeft: '20px', marginTop: '10px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--airbnb-light)', marginBottom: '5px' }}>
              Anak ({children.length}):
            </div>
            {children.map(child => renderMemberNode(child, depth + 1, updatedRenderedSpouses))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="section-header mb-4">
        <h2>🌳 Pokok Keluarga</h2>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button 
            className="btn btn-outline"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Batal' : '+ Tambah Ahli'}
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => {
              if (selectedMember) {
                setRelationshipType('child');
                setShowAddForm(true);
              } else {
                alert('Sila pilih ahli terlebih dahulu untuk tambah anak/pasangan');
              }
            }}
            disabled={!selectedMember}
          >
            + Tambah kepada {selectedMember?.nama_penuh || '...'}
          </button>
        </div>
      </div>

      {/* Add Member Form */}
      {showAddForm && (
        <div className="card mb-4">
          <MemberForm 
            onSubmit={(data) => {
              const memberData = {
                ...data,
                parent_id: relationshipType === 'child' && selectedMember ? selectedMember.id : null,
                spouse_id: relationshipType === 'spouse' && selectedMember ? selectedMember.id : null
              };
              onAddMember(memberData);
              setShowAddForm(false);
              setSelectedMember(null);
            }}
            onCancel={() => {
              setShowAddForm(false);
              setSelectedMember(null);
            }}
            isRoot={!selectedMember}
          />
          
          {selectedMember && (
            <div className="mt-3">
              <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                <label>
                  <input
                    type="radio"
                    name="relationship"
                    checked={relationshipType === 'child'}
                    onChange={() => setRelationshipType('child')}
                  />
                  <span style={{ marginLeft: '5px' }}>Anak kepada {selectedMember.nama_penuh}</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="relationship"
                    checked={relationshipType === 'spouse'}
                    onChange={() => setRelationshipType('spouse')}
                  />
                  <span style={{ marginLeft: '5px' }}>Pasangan kepada {selectedMember.nama_penuh}</span>
                </label>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Family Tree Display */}
      <div className="card">
        {rootMembers.length === 0 ? (
          <div className="empty-state">
            <h3>📭 Tiada Data Keluarga</h3>
            <p>Mulakan dengan menambah ahli pertama sebagai akar pokok keluarga.</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              + Tambah Ahli Pertama
            </button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
              <h3>Struktur Keluarga</h3>
              <p style={{ color: 'var(--airbnb-light)', fontSize: '0.9rem' }}>
                Klik pada ahli untuk lihat maklumat atau tambah anak/pasangan.
                {selectedMember && ` Terpilih: ${selectedMember.nama_penuh}`}
              </p>
            </div>
            
            <div style={{ maxHeight: '500px', overflowY: 'auto', padding: '10px' }}>
              {rootMembers.map(member => renderMemberNode(member, 0, new Set()))}
            </div>
            
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
              <div className="grid grid-3 text-center">
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--airbnb-primary)' }}>
                    {members.length}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--airbnb-light)' }}>Jumlah Ahli</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--airbnb-secondary)' }}>
                    {rootMembers.length}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--airbnb-light)' }}>Akar Keluarga</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--airbnb-accent)' }}>
                    {Math.max(...members.map(m => {
                      let depth = 0;
                      let current = m;
                      const visited = new Set();
                      
                      while (current.parent_id && !visited.has(current.id)) {
                        visited.add(current.id);
                        depth++;
                        const parent = members.find(mm => mm.id === current.parent_id);
                        if (!parent) break; // Parent not found
                        current = parent;
                      }
                      return depth;
                    }), 0) + 1}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--airbnb-light)' }}>Kedalaman</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selected Member Details */}
      {selectedMember && !showAddForm && (
        <div className="card mt-4">
          <div className="section-header">
            <h3>Maklumat Terpilih</h3>
            <button 
              className="btn btn-outline"
              onClick={() => setSelectedMember(null)}
            >
              Tutup
            </button>
          </div>
          <MemberCard 
            member={selectedMember}
            onUpdate={onUpdateMember}
            onDelete={(id) => {
              onDeleteMember(id);
              setSelectedMember(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FamilyTreeSimple;