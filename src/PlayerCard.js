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
    <div className="card h-100 shadow-sm">
      <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">{player.name}</h5>
        <button className="btn btn-sm btn-outline-danger" onClick={onRemove}>삭제</button>
      </div>
      <div className="card-body">
        <div className="text-center mb-4">
          <h3 className="display-4">{totalPoints}</h3>
          <h6 className="text-muted">총 득점</h6>
        </div>

        <div className="row text-center">
          {shotTypes.map(({ name, type }) => (
            <div className="col-12 mb-3" key={type}>
              <h6>{name}</h6>
              <div className="d-flex justify-content-center align-items-center mb-2">
                <button className="btn btn-sm btn-success me-1" onClick={() => onShot(type, true)}>성공</button>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => onShotCorrection(type, true)}>-</button>
                <button className="btn btn-sm btn-danger ms-3 me-1" onClick={() => onShot(type, false)}>실패</button>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => onShotCorrection(type, false)}>-</button>
              </div>
              <div className="fs-6 text-muted">
                {player.stats[`${type}Made`]} / {player.stats[`${type}Attempted`]}
                <span className="fw-bold ms-2">
                  ({calculatePercentage(player.stats[`${type}Made`], player.stats[`${type}Attempted`])})
                </span>
              </div>
            </div>
          ))}
        </div>

        <hr />

        <div className="row">
          {otherStats.map((statName) => (
            <div className="col-6 mb-3" key={statName}>
              <div className="d-flex flex-column align-items-center">
                <span className="text-capitalize small text-muted">{statTranslations[statName]}</span>
                <div className="d-flex align-items-center mt-1">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => onUpdateStat(statName, -1)}>-</button>
                  <span className="mx-2 fs-5 fw-bold">{player.stats[statName]}</span>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => onUpdateStat(statName, 1)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PlayerCard;
