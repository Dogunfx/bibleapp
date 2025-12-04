'use client';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function BibleComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [text, setText] = useState('');

  async function fetchVerse() {
    const obj = extractBibleToken(search);
    if (!obj) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/en-kjv/books/${obj?.book}/chapters/${obj?.chapter}/verses/${obj?.verse_from}.json`
      )
        .then((response) => response.json())
        .then((data) => data.text);
      setText(res);
    } catch {
      toast.error('Could not fetch bible verse ' + search);
    } finally {
      setIsLoading(false);
    }
  }

  function extractBibleToken(desc: string) {
    const str = desc.trim().replace(/\s+/g, ' ').toLowerCase();
    const regex = /^(.+?)\s+(\d+):(\d+)(?:[-–](\d+))?$/;
    const match = str.match(regex);
    if (!match) return null;
    const [, book, chapter, verseFrom, verseTo] = match;

    return {
      book,
      chapter,
      verse_from: verseFrom,
      verse_to: verseTo || verseFrom,
    };
  }

  return (
    <div>
      <h1>Dogunfx Bible App</h1>
      <div className="shadow p-4 w-1/3  rounded">{text}</div>
      <div className="w-1/3 mt-6">
        <Input
          className="my-2"
          onChange={(evt) => {
            setSearch(evt.target.value);
          }}
          placeholder="Enter the bible verse (e.g john 1:1)"
        />
        <Button onClick={fetchVerse} size="sm" disabled={isLoading}>
          {isLoading && <Loader2 className="animate-spin" />}
          Search Verse
        </Button>
      </div>
    </div>
  );
}
