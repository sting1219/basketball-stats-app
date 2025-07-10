import React from 'react';

function PlayerStatsTable({ players }) {
  if (players.length === 0) {
    return null;
  }

  const calculateTotalPoints = (stats) => {
    return stats.twoPointsMade * 2 + stats.threePointsMade * 3 + stats.freeThrowsMade;
  };

  const calculatePercentage = (made, attempted) => {
    if (attempted === 0) return '0.0%';
    return ((made / attempted) * 100).toFixed(1) + '%';
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="h5 mb-0">개인 선수 스탯</h2>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>선수</th>
                <th>득점</th>
                <th>2점 (성공/시도)</th>
                <th>2점 성공률</th>
                <th>3점 (성공/시도)</th>
                <th>3점 성공률</th>
                <th>자유투 (성공/시도)</th>
                <th>자유투 성공률</th>
                <th>리바운드</th>
                <th>어시스트</th>
                <th>스틸</th>
                <th>블록</th>
                <th>턴오버</th>
                <th>파울</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr key={index}>
                  <td>{player.name}</td>
                  <td>{calculateTotalPoints(player.stats)}</td>
                  <td>{player.stats.twoPointsMade}/{player.stats.twoPointsAttempted}</td>
                  <td>{calculatePercentage(player.stats.twoPointsMade, player.stats.twoPointsAttempted)}</td>
                  <td>{player.stats.threePointsMade}/{player.stats.threePointsAttempted}</td>
                  <td>{calculatePercentage(player.stats.threePointsMade, player.stats.threePointsAttempted)}</td>
                  <td>{player.stats.freeThrowsMade}/{player.stats.freeThrowsAttempted}</td>
                  <td>{calculatePercentage(player.stats.freeThrowsMade, player.stats.freeThrowsAttempted)}</td>
                  <td>{player.stats.rebounds}</td>
                  <td>{player.stats.assists}</td>
                  <td>{player.stats.steals}</td>
                  <td>{player.stats.blocks}</td>
                  <td>{player.stats.turnovers}</td>
                  <td>{player.stats.fouls}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PlayerStatsTable;