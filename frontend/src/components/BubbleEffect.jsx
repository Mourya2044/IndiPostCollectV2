export const BubbleEffect = () => (
    <div className="absolute inset-0 overflow-hidden z-0">
      {[...Array(12)].map((_, i) => {
        const size = Math.random() * 20 + 10; // radius between 10px and 30px
        return (
          <div
            key={i}
            className="bubble"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 100}px`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        );
      })}
    </div>
  );
  