import styles from "./Sparkline.module.css";

const WIDTH = 112;
const HEIGHT = 28;
const PAD = 2;

/**
 * A small line of daily counts, oldest first. Real data only: a form with no responses
 * draws a flat dashed baseline. The line is decorative for sighted users; `label` carries
 * the same information as text for everyone else.
 */
export function Sparkline({ values, label }: { values: number[]; label: string }) {
  const max = Math.max(...values, 0);
  const step = values.length > 1 ? (WIDTH - PAD * 2) / (values.length - 1) : 0;
  const y = (v: number) => (max === 0 ? HEIGHT - PAD : HEIGHT - PAD - (v / max) * (HEIGHT - PAD * 2));
  const points = values.map((v, i) => `${(PAD + i * step).toFixed(1)},${y(v).toFixed(1)}`);

  return (
    <svg className={styles.spark} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width={WIDTH} height={HEIGHT} role="img" aria-label={label}>
      <line className={styles.base} x1={PAD} x2={WIDTH - PAD} y1={HEIGHT - PAD} y2={HEIGHT - PAD} />
      {max > 0 ? (
        <>
          <polygon className={styles.area} points={`${PAD},${HEIGHT - PAD} ${points.join(" ")} ${WIDTH - PAD},${HEIGHT - PAD}`} />
          <polyline className={styles.line} points={points.join(" ")} />
          <circle className={styles.dot} cx={points.at(-1)!.split(",")[0]} cy={points.at(-1)!.split(",")[1]} r={2.25} />
        </>
      ) : null}
    </svg>
  );
}
