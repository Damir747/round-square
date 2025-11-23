export default function Goose({ onClick }: { onClick?: () => void }) {
  const art = `
            ░░░░░░░░░░░░░░░            
          ░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░           
        ░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░         
        ░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░         
      ░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░       
    ░░▒▒▒▒░░░░▓▓▓▓▓▓▓▓▓▓▓▓░░░░▒▒▒▒░░   
    ░░▒▒▒▒▒▒▒▒░░░░░░░░░░░░▒▒▒▒▒▒▒▒░░   
    ░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░   
      ░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░     
        ░░░░░░░░░░░░░░░░░░░░░░░░░░   
  `;

  return (
    <pre
      onClick={onClick}
      style={{
        fontFamily: "monospace",
        fontSize: "12px",
        lineHeight: "12px",
        whiteSpace: "pre",
        textAlign: "center",
        marginTop: "20px",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {art}
    </pre>
  );
}
