import React, { useState, useEffect } from 'react';
import { Tree } from 'react-d3-tree';
import { familyStorage } from '../utils/storage';
import MemberForm from './MemberForm';
import MemberCard from './MemberCard';
import './FamilyTree.css';

const FamilyTree = ({ members, onAddMember, onUpdateMember, onDeleteMember }) => {
  const [treeData, setTreeData] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [relationshipType, setRelationshipType] = useState('child');
  const [treeOrientation, setTreeOrientation] = useState('vertical');

  // Convert members to tree structure for react-d3-tree
  useEffect(() => {
    if (members.length === 0) {
      setTreeData(null);
      return;
    }

    // Find root members (no parent)
    const roots = members.filter(member => !member.parent_id);
    
    // Build tree recursively
    const buildTree = (member) => {
      const node = {
        name: member.nama_penuh,
        attributes: {
          id: member.id,
          age: familyStorage.calculateAge(member.tarikh_lahir),
          job: member.pekerjaan,
          location: member.lokasi,
          gender: member.jantina,
          phone: member.no_telefon,
          image: member.gambar_profil_url
        }
      };

      // Add spouse if exists
      if (member.spouse_id) {
        const spouse = members.find(m => m.id === member.spouse_id);
        if (spouse) {
          node.spouse = {
            name: spouse.nama_penuh,
            attributes: {
              id: spouse.id,
              age: familyStorage.calculateAge(spouse.tarikh_lahir),
              job: spouse.pekerjaan,
              location: spouse.lokasi,
              gender: spouse.jantina,
              phone: spouse.no_telefon,
              image: spouse.gambar_profil_url
            }
          };
        }
      }

      // Add children
      const children = members.filter(m => m.parent_id === member.id);
      if (children.length > 0) {
        node.children = children.map(buildTree);
      }

      return node;
    };

    // If multiple roots, create a virtual root
    if (roots.length > 1) {
      const virtualRoot = {
        name: 'Keluarga',
        children: roots.map(buildTree)
      };
      setTreeData(virtualRoot);
    } else if (roots.length === 1) {
      setTreeData(buildTree(roots[0]));
    } else {
      setTreeData(null);
    }
  }, [members]);

  const handleNodeClick = (nodeData) => {
    const memberId = nodeData.attributes?.id;
    if (memberId) {
      const member = members.find(m => m.id === memberId);
      setSelectedMember(member);
    }
  };

  const handleAddRelative = (type) => {
    setRelationshipType(type);
    setShowAddForm(true);
  };

  const handleFormSubmit = (memberData) => {
    const newMember = {
      ...memberData,
      parent_id: relationshipType === 'child' && selectedMember ? selectedMember.id : undefined,
      spouse_id: relationshipType === 'spouse' && selectedMember ? selectedMember.id : undefined
    };
    
    // If adding spouse, also update the selected member's spouse_id
    if (relationshipType === 'spouse' && selectedMember) {
      onUpdateMember(selectedMember.id, { spouse_id: newMember.id });
    }
    
    onAddMember(newMember);
    setShowAddForm(false);
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
  };

  const handleEditMember = () => {
    if (selectedMember) {
      const updatedData = {
        nama_penuh: prompt('Nama Penuh:', selectedMember.nama_penuh) || selectedMember.nama_penuh,
        tarikh_lahir: prompt('Tarikh Lahir (YYYY-MM-DD):', selectedMember.tarikh_lahir) || selectedMember.tarikh_lahir,
        no_telefon: prompt('No Telefon:', selectedMember.no_telefon) || selectedMember.no_telefon,
        pekerjaan: prompt('Pekerjaan:', selectedMember.pekerjaan) || selectedMember.pekerjaan,
        lokasi: prompt('Lokasi (Daerah/Negeri):', selectedMember.lokasi) || selectedMember.lokasi,
        gambar_profil_url: prompt('URL Gambar Profil:', selectedMember.gambar_profil_url) || selectedMember.gambar_profil_url
      };
      
      onUpdateMember(selectedMember.id, updatedData);
    }
  };

  const handleDeleteMember = () => {
    if (selectedMember && window.confirm(`Adakah anda pasti mahu padam ${selectedMember.nama_penuh}?`)) {
      onDeleteMember(selectedMember.id);
      setSelectedMember(null);
    }
  };

  return (
    <div className="family-tree">
      {/* Controls */}
      <div className="tree-controls">
        <div className="control-group">
          <button 
            className={`orientation-btn ${treeOrientation === 'vertical' ? 'active' : ''}`}
            onClick={() => setTreeOrientation('vertical')}
          >
            ↕️ Menegak
          </button>
          <button 
            className={`orientation-btn ${treeOrientation === 'horizontal' ? 'active' : ''}`}
            onClick={() => setTreeOrientation('horizontal')}
          >
            ↔️ Mendatar
          </button>
        </div>
        
        <div className="control-group">
          <button 
            className="action-btn"
            onClick={() => {
              const data = familyStorage.getAllMembers();
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'pokok-keluarga.json';
              a.click();
            }}
          >
            💾 Export Pokok
          </button>
        </div>
      </div>

      {/* Tree Visualization */}
      <div className="tree-container">
        {treeData ? (
          <div className="tree-wrapper">
            <Tree
              data={treeData}
              orientation={treeOrientation}
              translate={{ x: 400, y: 50 }}
              pathFunc="step"
              separation={{ siblings: 1, nonSiblings: 2 }}
              nodeSize={{ x: 200, y: 150 }}
              renderCustomNodeElement={({ nodeDatum, toggleNode }) => (
                <g>
                  {/* Node circle */}
                  <circle
                    r={15}
                    fill={nodeDatum.attributes?.gender === 'Perempuan' ? '#ffb6c1' : '#87ceeb'}
                    stroke="#333"
                    strokeWidth="2"
                    onClick={() => handleNodeClick(nodeDatum)}
                    style={{ cursor: 'pointer' }}
                  />
                  
                  {/* Node text */}
                  <text
                    fill="black"
                    strokeWidth="1"
                    x={20}
                    y={5}
                    onClick={() => handleNodeClick(nodeDatum)}
                    style={{ cursor: 'pointer' }}
                  >
                    {nodeDatum.name}
                  </text>
                  
                  {/* Age text */}
                  <text
                    fill="#666"
                    strokeWidth="0.5"
                    x={20}
                    y={20}
                    fontSize="10"
                  >
                    {nodeDatum.attributes?.age} tahun
                  </text>
                </g>
              )}
              onNodeClick={handleNodeClick}
            />
          </div>
        ) : (
          <div className="empty-tree">
            <h3>🌱 Mulakan Pokok Keluarga Anda</h3>
            <p>Tiada data pokok keluarga. Kembali ke Dashboard untuk tambah ahli pertama.</p>
            <p className="hint">
              Tip: Tambah ahli pertama sebagai "akar" pokok, kemudian tambah pasangan dan anak-anak.
            </p>
          </div>
        )}
      </div>

      {/* Selected Member Panel */}
      <div className="selected-panel">
        {selectedMember ? (
          <>
            <div className="panel-header">
              <h3>Ahli Terpilih</h3>
              <div className="panel-actions">
                <button className="icon-btn" onClick={handleEditMember} title="Edit">
                  ✏️
                </button>
                <button className="icon-btn delete" onClick={handleDeleteMember} title="Padam">
                  🗑️
                </button>
              </div>
            </div>
            
            <MemberCard member={selectedMember} />
            
            <div className="relationship-actions">
              <h4>Tambah Hubungan:</h4>
              <div className="action-buttons">
                <button 
                  className="rel-btn"
                  onClick={() => handleAddRelative('child')}
                >
                  👶 Tambah Anak
                </button>
                <button 
                  className="rel-btn"
                  onClick={() => handleAddRelative('spouse')}
                >
                  💖 Tambah Pasangan
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="no-selection">
            <h3>👈 Pilih Ahli</h3>
            <p>Klik pada mana-mana nod dalam pokok keluarga untuk melihat butiran dan menambah hubungan.</p>
          </div>
        )}
      </div>

      {/* Add Member Form Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                {relationshipType === 'child' ? 'Tambah Anak' : 'Tambah Pasangan'}
                {selectedMember && ` untuk ${selectedMember.nama_penuh}`}
              </h3>
              <button className="close-btn" onClick={handleFormCancel}>×</button>
            </div>
            <MemberForm 
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              relationshipType={relationshipType}
              parentMember={selectedMember}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyTree;