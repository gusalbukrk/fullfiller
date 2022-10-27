import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCopy, faFileAlt } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fullfiller from 'fullfiller/src';
import React from 'react';

function Form(): JSX.Element {
  // input
  const [input, setInput] = React.useState('');

  // options
  const [quantity, setQuantity] = React.useState(5);
  const [unit, setUnit] = React.useState('paragraphs');
  const [format, setFormat] = React.useState('plain');

  // output
  const [output, setOutputBase] = React.useState({ title: '', body: '' });
  const setOutput = async () => {
    const filler = await fullfiller(input, {
      unit: unit as 'paragraphs' | 'words',
      quantity,
      format: format as 'plain' | 'html',
    });

    setOutputBase({
      title: filler.title,
      body:
        format === 'plain'
          ? filler.body.replace(/\n/g, '\n\n')
          : filler.body.replace(/<\/p>(?!$)/g, '</p>\n\n'),
    });
  };

  const [userHasJustCopiedOutput, setUserHasJustCopiedOutput] =
    React.useState(false); // has output been copied in the past few seconds

  const generateButtonRef = React.useRef<HTMLButtonElement>(null);
  const generateButtonElement = generateButtonRef.current as HTMLButtonElement;

  const loadingOverlayRef = React.useRef<HTMLDivElement>(null);
  const loadingOverlayElement = loadingOverlayRef.current as HTMLDivElement;

  const copyButtonRef = React.useRef<HTMLButtonElement>(null);
  const copyButtonElement = copyButtonRef.current as HTMLButtonElement;

  const handleGenerateButton = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    generateButtonElement.disabled = true;

    copyButtonElement.classList.add('d-none');
    setUserHasJustCopiedOutput(false);

    loadingOverlayElement.classList.remove('d-none');

    await setOutput();

    // spinner animation is freezing while fetching
    // it looks weird to suddenly go from freezed spinner to output filled with text
    // solution: after fetch is done and animation unfreezes, keep the spinner visible for a bit
    setTimeout(() => {
      loadingOverlayElement.classList.add('d-none');

      copyButtonElement.classList.remove('d-none');

      // 1 or 2 seconds after the generate button is clicked
      // site becomes unresponsive and after 1 or 2 seconds comes back to normal
      // if generate button is clicked while site is unresponsive
      // click(s) will take effect when site becomes responsive
      // thus, restarting the fetch process
      // solution: wait a bit to enable generate button (use `setTimeout`, it can be just 0 seconds)
      // thus, when delayed clicks come in, generate button would still be disabled
      generateButtonElement.disabled = false;
    }, 1500);
  };

  const handleCopyButton = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (userHasJustCopiedOutput) return;

    try {
      // NOTE: ´clipboard` inside `navigator` is only available from secure origins
      // i.e. https or localhost
      // in a development environment, if you try to access via **ip** (i.e. `http://192.168.1.4:8080`)
      // instead of using **localhost** (i.e. `http://localhost:8080`)
      // you will get the following error:
      // `TypeError: Cannot read properties of undefined (reading 'writeText')`
      // as a consequence, you cannot test the copy to clipboard functionality from devices
      // inside your network other than the one from which the files are being served
      await navigator.clipboard.writeText(output.body);

      setUserHasJustCopiedOutput(true);

      setTimeout(() => {
        setUserHasJustCopiedOutput(false);
      }, 5000);
    } catch (error) {
      console.error("ERROR: Couldn't copy filler text to clipboard."); // eslint-disable-line no-console
    }
  };

  return (
    <form>
      <section id="row-one">
        {/* input */}
        <article id="outer-input">
          <input
            type="text"
            id="input"
            placeholder={`input (e.g. "harry potter")`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </article>

        {/* options.quantity */}
        <article id="outer-quantity">
          <input
            type="number"
            name="quantity"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </article>
      </section>

      <section id="row-two">
        {/* options.unit */}
        <fieldset>
          <legend>unit</legend>

          <article className="option">
            <input
              type="radio"
              name="unit"
              id="unit-p"
              value="paragraphs"
              checked={unit === 'paragraphs'}
              onChange={() => setUnit('paragraphs')}
            />
            <label htmlFor="unit-p">paragraphs</label>
          </article>

          <article className="option">
            <input
              type="radio"
              name="unit"
              id="unit-w"
              value="words"
              checked={unit === 'words'}
              onChange={() => setUnit('words')}
            />
            <label htmlFor="unit-w">words</label>
          </article>
        </fieldset>

        {/* options.format */}
        <fieldset>
          <legend>format</legend>

          <article className="option">
            <input
              type="radio"
              name="format"
              id="format-p"
              value="plain"
              checked={format === 'plain'}
              onChange={() => setFormat('plain')}
            />
            <label htmlFor="format-p">plain</label>
          </article>

          <article className="option">
            <input
              type="radio"
              name="format"
              id="format-h"
              value="html"
              checked={format === 'html'}
              onChange={() => setFormat('html')}
            />
            <label htmlFor="format-h">html</label>
          </article>
        </fieldset>
      </section>

      <section id="row-three">
        {/* output */}
        <textarea
          id="output"
          rows={12}
          cols={50}
          value={output.body}
          readOnly
          tabIndex={-1}
        />

        <article
          id="loading-overlay"
          className="d-none"
          ref={loadingOverlayRef}
        >
          <FontAwesomeIcon
            id="loading-icon"
            icon={faSpinner as IconProp}
            spin
          />
        </article>
      </section>

      {/** when you have multiple buttons inside form,
       * only the first one is invoked at `enter` key press */}
      <section id="row-four">
        <button
          id="button-generate"
          ref={generateButtonRef}
          // https://github.com/typescript-eslint/typescript-eslint/issues/4619
          onClick={handleGenerateButton} // eslint-disable-line @typescript-eslint/no-misused-promises
        >
          <FontAwesomeIcon id="generate-icon" icon={faFileAlt as IconProp} />
          Generate
        </button>

        <button
          id="button-copy"
          className="d-none"
          ref={copyButtonRef}
          onClick={handleCopyButton} // eslint-disable-line @typescript-eslint/no-misused-promises
        >
          <FontAwesomeIcon
            id="copy-icon"
            icon={(userHasJustCopiedOutput ? faCheck : faCopy) as IconProp}
          />
          {userHasJustCopiedOutput ? 'Copied' : 'Copy'}
        </button>
      </section>
    </form>
  );
}

export default Form;
