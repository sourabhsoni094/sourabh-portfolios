// Line-by-line text reveal. Locomotive Scroll adds `.is-inview` to [data-scroll] elements; CSS does the rest.
export default function Reveal({ as: Tag = 'div', lines, className = '', children, ...rest }) {
  return (
    <Tag data-scroll className={`reveal ${className}`} {...rest}>
      {lines
        ? lines.map((l, i) => (
            <span className="reveal__line" key={i} style={{ '--i': i }}><span>{l}</span></span>
          ))
        : children}
    </Tag>
  );
}
