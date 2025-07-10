import React, { useState, useEffect } from 'react';
import PlayerCard from './PlayerCard';
import TeamStatsSummary from './TeamStatsSummary';
import PlayerStatsTable from './PlayerStatsTable';
import * as XLSX from 'xlsx';

function App() {
  // 앱 시작 시 localStorage에서 데이터를 불러오거나, 없으면 빈 배열로 시작
  const [players, setPlayers] = useState(() => {
    try {
      const savedPlayers = localStorage.getItem('players');
      return savedPlayers ? JSON.parse(savedPlayers) : [];
    } catch (error) {
      console.error("Failed to parse players from localStorage", error);
      return [];
    }
  });

  const [newPlayerName, setNewPlayerName] = useState('');

  // players 상태가 변경될 때마다 localStorage에 자동으로 저장
  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players));
  }, [players]);

  const initialStats = {
    twoPointsMade: 0,
    twoPointsAttempted: 0,
    threePointsMade: 0,
    threePointsAttempted: 0,
    freeThrowsMade: 0,
    freeThrowsAttempted: 0,
    rebounds: 0,
    assists: 0,
    steals: 0,
    blocks: 0,
    turnovers: 0,
    fouls: 0,
  };

  const addPlayer = () => {
    if (newPlayerName.trim() !== '') {
      setPlayers([...players, { name: newPlayerName, stats: { ...initialStats } }]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (index) => {
    const newPlayers = [...players];
    newPlayers.splice(index, 1);
    setPlayers(newPlayers);
  };

  const handleShot = (playerIndex, shotType, isMade) => {
    const newPlayers = [...players];
    const playerStats = newPlayers[playerIndex].stats;

    playerStats[`${shotType}Attempted`] += 1;
    if (isMade) {
      playerStats[`${shotType}Made`] += 1;
    }
    setPlayers(newPlayers);
  };

  const handleShotCorrection = (playerIndex, shotType, wasMade) => {
    const newPlayers = [...players];
    const playerStats = newPlayers[playerIndex].stats;

    if (wasMade) {
      // 'Made' 기록을 수정할 때: 성공과 시도 횟수를 모두 1씩 줄임
      if (playerStats[`${shotType}Made`] > 0) {
        playerStats[`${shotType}Made`] -= 1;
        playerStats[`${shotType}Attempted`] -= 1;
      }
    } else {
      // 'Missed' 기록을 수정할 때: 시도 횟수만 1 줄임
      // 단, 시도 횟수가 성공 횟수보다 적어지면 안 됨
      if (playerStats[`${shotType}Attempted`] > playerStats[`${shotType}Made`]) {
        playerStats[`${shotType}Attempted`] -= 1;
      }
    }
    setPlayers(newPlayers);
  };

  const updateStat = (playerIndex, statName, value) => {
    const newPlayers = [...players];
    const playerStats = newPlayers[playerIndex].stats;
    playerStats[statName] = Math.max(0, playerStats[statName] + value);
    setPlayers(newPlayers);
  };

  const resetGame = () => {
    // 확인 절차를 추가하여 사용자의 실수를 방지
    const confirmReset = window.confirm("정말로 게임을 초기화하시겠습니까? 모든 데이터가 영구적으로 삭제됩니다.");
    if (confirmReset) {
      setPlayers([]);
      // localStorage에서도 데이터를 삭제
      localStorage.removeItem('players');
    }
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // Helper function to calculate percentage
    const calculatePercentage = (made, attempted) => {
      if (attempted === 0) return '0.0%';
      return ((made / attempted) * 100).toFixed(1) + '%';
    };

    // Team Stats Sheet
    const totalStats = players.reduce((acc, player) => {
        for (const key in player.stats) {
            acc[key] = (acc[key] || 0) + player.stats[key];
        }
        return acc;
    }, { ...initialStats });

    const totalPoints = totalStats.twoPointsMade * 2 + totalStats.threePointsMade * 3 + totalStats.freeThrowsMade;

    const teamData = [
        ['팀 전체 스탯'],
        ['총 득점', totalPoints],
        [],
        ['리바운드', totalStats.rebounds],
        ['어시스트', totalStats.assists],
        ['스틸', totalStats.steals],
        ['블록', totalStats.blocks],
        ['턴오버', totalStats.turnovers],
        ['파울', totalStats.fouls],
        [],
        ['2점슛', `${totalStats.twoPointsMade} / ${totalStats.twoPointsAttempted} (${calculatePercentage(totalStats.twoPointsMade, totalStats.twoPointsAttempted)})`],
        ['3점슛', `${totalStats.threePointsMade} / ${totalStats.threePointsAttempted} (${calculatePercentage(totalStats.threePointsMade, totalStats.threePointsAttempted)})`],
        ['자유투', `${totalStats.freeThrowsMade} / ${totalStats.freeThrowsAttempted} (${calculatePercentage(totalStats.freeThrowsMade, totalStats.freeThrowsAttempted)})`]
    ];

    const wsTeam = XLSX.utils.aoa_to_sheet(teamData);
    XLSX.utils.book_append_sheet(wb, wsTeam, 'Team Stats');

    // Individual Player Stats Sheet
    const individualData = players.map(player => ({
        '선수': player.name,
        '득점': player.stats.twoPointsMade * 2 + player.stats.threePointsMade * 3 + player.stats.freeThrowsMade,
        '2점 (성공/시도)': `${player.stats.twoPointsMade}/${player.stats.twoPointsAttempted}`,
        '2점 성공률': calculatePercentage(player.stats.twoPointsMade, player.stats.twoPointsAttempted),
        '3점 (성공/시도)': `${player.stats.threePointsMade}/${player.stats.threePointsAttempted}`,
        '3점 성공률': calculatePercentage(player.stats.threePointsMade, player.stats.threePointsAttempted),
        '자유투 (성공/시도)': `${player.stats.freeThrowsMade}/${player.stats.freeThrowsAttempted}`,
        '자유투 성공률': calculatePercentage(player.stats.freeThrowsMade, player.stats.freeThrowsAttempted),
        '리바운드': player.stats.rebounds,
        '어시스트': player.stats.assists,
        '스틸': player.stats.steals,
        '블록': player.stats.blocks,
        '턴오버': player.stats.turnovers,
        '파울': player.stats.fouls
    }));

    const wsIndividual = XLSX.utils.json_to_sheet(individualData);
    XLSX.utils.book_append_sheet(wb, wsIndividual, 'Individual Stats');

    XLSX.writeFile(wb, 'basketball-stats.xlsx');
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">농구 스탯 트래커</h1>
      <TeamStatsSummary players={players} />
      <PlayerStatsTable players={players} />
      <div className="row mb-3">
        <div className="col-12 col-md-8 mb-2 mb-md-0">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="선수 이름 입력"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
          />
        </div>
        <div className="col-12 col-md-4 d-grid gap-2 d-md-block">
          <button className="btn btn-primary btn-lg me-md-2" type="button" onClick={addPlayer}>선수 추가</button>
          <button className="btn btn-danger btn-lg" type="button" onClick={resetGame}>게임 초기화</button>
          <button className="btn btn-success btn-lg" type="button" onClick={exportToExcel}>Export to Excel</button>
        </div>
      </div>

      <div className="row">
        {players.map((player, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <PlayerCard
              player={player}
              onRemove={() => removePlayer(index)}
              onUpdateStat={(statName, value) => updateStat(index, statName, value)}
              onShot={(shotType, isMade) => handleShot(index, shotType, isMade)}
              onShotCorrection={(shotType, wasMade) => handleShotCorrection(index, shotType, wasMade)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;