/**
 * Statcounter snippet, rendered on the server so it appears in the HTML of
 * every page just before </body>, with the noscript image for clients without
 * JavaScript.
 */
export default function Statcounter() {
  return (
    <>
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `var sc_project=13364984; 
var sc_invisible=1; 
var sc_security="526d267f"; `,
        }}
      />
      <script
        type="text/javascript"
        src="https://www.statcounter.com/counter/counter.js"
        async
      />
      <noscript>
        <div className="statcounter">
          <a
            title="Web Analytics Made Easy - Statcounter"
            href="https://statcounter.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="statcounter"
              src="https://c.statcounter.com/13364984/0/526d267f/1/"
              alt="Web Analytics Made Easy - Statcounter"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </a>
        </div>
      </noscript>
    </>
  );
}
