 import React from 'react';

function PlayerCard({ player, onRemove, onUpdateStat, onShot, onShotCorrection }) {

  const calculatePercentage = (made, attempted) => {
    if (attempted === 0) {
      return '0.0%';
    }
    return ((made / attempted) * 100).toFixed(1) + '%';
  };

  const totalPoints =
    player.stats.twoPointsMade * 2 +
    player.stats.threePointsMade * 3 +
    player.stats.freeThrowsMade;

  const shotTypes = [
    { name: '2점슛', type: 'twoPoints' },
    { name: '3점슛', type: 'threePoints' },
    { name: '자유투', type: 'freeThrows' }
  ];

  const otherStats = ['rebounds', 'assists', 'steals', 'blocks', 'turnovers', 'fouls'];

  const statTranslations = {
    rebounds: "리바운드",
    assists: "어시스트",
    steals: "스틸",
    blocks: "블록",
    turnovers: "턴오버",
    fouls: "파울",
  };

  return (
    <div className="card h-100">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">{player.name}</h5>
        <button className="btn btn-sm btn-outline-danger" onClick={onRemove}>삭제</button>
      </div>
      <div className="card-body">
        <h4 className="text-center mb-3">총 득점: {totalPoints}</h4>

        {shotTypes.map(({ name, type }) => (
          <div className="mb-3" key={type}>
            <h6>{name}</h6>
            <div className="d-flex justify-content-start align-items-center mb-1">
              {/* --- 수정된 부분 --- */}
              <button className="btn btn-sm btn-success" onClick={() => onShot(type, true)}>성공</button>
              <button className="btn btn-sm btn-outline-secondary ms-1" onClick={() => onShotCorrection(type, true)}>-</button>

              <button className="btn btn-sm btn-danger ms-3" onClick={() => onShot(type, false)}>실패</button>
              <button className="btn btn-sm btn-outline-secondary ms-1" onClick={() => onShotCorrection(type, false)}>-</button>
              {/* ------------------ */}
            </div>
            <div className="text-muted">
              {player.stats[`${type}Made`]} / {player.stats[`${type}Attempted`]}
              <span className="ms-2">({calculatePercentage(player.stats[`${type}Made`], player.stats[`${type}Attempted`])})</span>
            </div>
          </div>
        ))}

        <hr />

        <ul className="list-group list-group-flush">
          {otherStats.map((statName) => (
            <li className="list-group-item d-flex justify-content-between align-items-center px-0" key={statName}>
              <span className="text-capitalize">{statTranslations[statName]}</span>
              <div>
                <button className="btn btn-sm btn-secondary me-2" onClick={() => onUpdateStat(statName, -1)}>-</button>
                <span className="badge bg-primary rounded-pill">{player.stats[statName]}</span>
                <button className="btn btn-sm btn-secondary ms-2" onClick={() => onUpdateStat(statName, 1)}>+</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PlayerCard;