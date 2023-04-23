import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCopy, faFileAlt } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fullfiller from 'fullfiller/src';
import {
  fillerType,
  WithRequired,
  freqMapType,
  Overwrite,
} from 'fullfiller-common/src/types';
import { openDB, DBSchema } from 'idb';
import React from 'react';

type fullfillerDBType = DBSchema & {
  cache: {
    key: string;
    value: {
      title: string;
      query: string[];
      map: freqMapType;
    };
  };
};

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
    const db = await openDB<fullfillerDBType>('fullfiller', 1, {
      upgrade(database) {
        database.createObjectStore('cache', { keyPath: 'title' });
      },
    });

    const record = (await db.getAll('cache')).find((r) =>
      r.query.includes(input)
    );

    const filler = (await fullfiller(
      record !== undefined ? { title: record.title, map: record.map } : input,
      {
        unit: unit as 'paragraphs' | 'words',
        quantity,
        format: format as 'plain' | 'html',
        include: ['title', 'freqMap'],
      }
    )) as WithRequired<
      Overwrite<fillerType, { body: string }>,
      'title' | 'freqMap'
    >;

    if (record === undefined) {
      const recordWithMatchingTitle = await db.get('cache', filler.title);

      if (recordWithMatchingTitle !== undefined) {
        await db.put('cache', {
          ...recordWithMatchingTitle,
          query: [...recordWithMatchingTitle.query, input],
        });
      } else {
        await db.add('cache', {
          query: [input],
          title: filler.title,
          map: filler.freqMap,
        });
      }
    }

    db.close();

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

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const textareaElement = textareaRef.current as HTMLTextAreaElement;

  const handleGenerateButton = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    setUserHasJustCopiedOutput(false);

    // textarea value is equal to `output.body`
    // consequently, reset output object will clear the textarea
    setOutputBase({ title: '', body: '' });

    loadingOverlayElement.classList.remove('d-none'); // display overlay containing spinner
    textareaElement.classList.add('bg-light-gray'); // enable textarea $light-gray background

    generateButtonElement.disabled = true; // disable generate button
    copyButtonElement.classList.add('d-none'); // hide copy button

    await setOutput();

    textareaElement.classList.remove('bg-light-gray'); // revert textarea background to white
    loadingOverlayElement.classList.add('d-none'); // hide overlay containing spinner
    copyButtonElement.classList.remove('d-none'); // display copy button
    generateButtonElement.disabled = false; // reenable generate button
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
          className="bg-light-gray"
          ref={textareaRef}
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
