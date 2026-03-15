import Masonry from 'react-masonry-css';
import '../styles/components/card-masonry.scss';

const DEFAULT_BREAKPOINTS = {
  default: 4,
  1200: 3,
  768: 2,
  576: 1,
};

export default function CardMasonry({ children, breakpointCols = DEFAULT_BREAKPOINTS, className = '' }) {
  return (
    <Masonry
      breakpointCols={breakpointCols}
      className={`card-masonry ${className}`.trim()}
      columnClassName="card-masonry__column"
    >
      {children}
    </Masonry>
  );
}
