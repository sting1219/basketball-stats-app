import React from 'react';

function TeamStatsSummary({ players }) {
  if (players.length === 0) {
    return null; // 선수가 없으면 아무것도 렌더링하지 않음
  }

  // 모든 선수의 스탯을 합산할 객체 초기화
  const totalStats = {
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

  // 모든 선수의 스탯을 합산
  players.forEach(player => {
    for (const key in player.stats) {
      totalStats[key] += player.stats[key];
    }
  });

  // 성공률 계산 함수 (0으로 나누는 경우 방지)
  const formatPercentage = (made, attempted) => {
    if (attempted === 0) return '0.0';
    return ((made / attempted) * 100).toFixed(1);
  };

  const twoPointPercentage = formatPercentage(totalStats.twoPointsMade, totalStats.twoPointsAttempted);
  const threePointPercentage = formatPercentage(totalStats.threePointsMade, totalStats.threePointsAttempted);
  const freeThrowPercentage = formatPercentage(totalStats.freeThrowsMade, totalStats.freeThrowsAttempted);
  const totalPoints = totalStats.twoPointsMade * 2 + totalStats.threePointsMade * 3 + totalStats.freeThrowsMade;

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header">
        <h2 className="h5 mb-0">팀 전체 스탯</h2>
      </div>
      <div className="card-body">
        <div className="row text-center">
          <div className="col-md-4">
            <h4>총 득점: {totalPoints}</h4>
          </div>
          <div className="col-md-8">
             <div className="d-flex justify-content-around">
                <span><strong>리바운드:</strong> {totalStats.rebounds}</span>
                <span><strong>어시스트:</strong> {totalStats.assists}</span>
                <span><strong>스틸:</strong> {totalStats.steals}</span>
                <span><strong>블록:</strong> {totalStats.blocks}</span>
                <span><strong>턴오버:</strong> {totalStats.turnovers}</span>
                <span><strong>파울:</strong> {totalStats.fouls}</span>
            </div>
          </div>
        </div>
        <hr />
        <div className="row mt-3">
          <div className="col-md-4">
            <p className="mb-1"><strong>2점슛</strong></p>
            <p>{totalStats.twoPointsMade} / {totalStats.twoPointsAttempted} ({twoPointPercentage}%)</p>
          </div>
          <div className="col-md-4">
            <p className="mb-1"><strong>3점슛</strong></p>
            <p>{totalStats.threePointsMade} / {totalStats.threePointsAttempted} ({threePointPercentage}%)</p>
          </div>
          <div className="col-md-4">
            <p className="mb-1"><strong>자유투</strong></p>
            <p>{totalStats.freeThrowsMade} / {totalStats.freeThrowsAttempted} ({freeThrowPercentage}%)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamStatsSummary;