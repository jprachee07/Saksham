import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function RadarChart({ scores = {}, maxScore = 10 }) {
  // 5-Axis Radar labels
  const labels = [
    'Communication',
    'Technical Depth',
    'Domain Relevance',
    'Problem Solving',
    'Confidence',
  ];

  // Map incoming scores flexibly (handling various possible key variations)
  const extractScore = (keyVariations, defaultVal = 7.5) => {
    for (const key of keyVariations) {
      if (scores && scores[key] !== undefined && scores[key] !== null) {
        return Number(scores[key]);
      }
    }
    return defaultVal;
  };

  const dataValues = [
    extractScore(['communication', 'Communication', 'comm'], 7.5),
    extractScore(['technicalDepth', 'technical_depth', 'TechnicalDepth', 'technical'], 8.5),
    extractScore(['domainRelevance', 'domain_relevance', 'DomainRelevance', 'domain'], 8.0),
    extractScore(['problemSolving', 'problem_solving', 'ProblemSolving', 'problem'], 7.8),
    extractScore(['confidenceComposure', 'confidence', 'Confidence', 'composure'], 7.5),
  ];

  const data = {
    labels,
    datasets: [
      {
        label: 'Candidate Competency',
        data: dataValues,
        backgroundColor: 'rgba(212, 175, 55, 0.25)',
        borderColor: '#D4AF37',
        borderWidth: 2.5,
        pointBackgroundColor: '#081525',
        pointBorderColor: '#D4AF37',
        pointHoverBackgroundColor: '#D4AF37',
        pointHoverBorderColor: '#081525',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        angleLines: {
          color: 'rgba(100, 116, 139, 0.25)',
          lineWidth: 1,
        },
        grid: {
          color: 'rgba(100, 116, 139, 0.2)',
          circular: true,
        },
        pointLabels: {
          color: '#172033',
          font: {
            family: "'Inter', sans-serif",
            size: 11,
            weight: '600',
          },
          padding: 10,
        },
        ticks: {
          display: true,
          stepSize: 2,
          color: '#64748B',
          backdropColor: 'transparent',
          font: {
            size: 9,
          },
        },
        suggestedMin: 0,
        suggestedMax: maxScore,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#081525',
        titleColor: '#F0C75E',
        bodyColor: '#F8FAFC',
        borderColor: '#D4AF37',
        borderWidth: 1,
        padding: 8,
        displayColors: false,
        callbacks: {
          label: (context) => `Score: ${context.parsed.r.toFixed(1)} / ${maxScore}`,
        },
      },
    },
  };

  return (
    <div className="radar-chart-container">
      <Radar data={data} options={options} />
      <style>{`
        .radar-chart-container {
          width: 100%;
          max-width: 380px;
          margin: 0 auto;
          position: relative;
        }
      `}</style>
    </div>
  );
}
