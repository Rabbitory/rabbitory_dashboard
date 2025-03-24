"use client"

import * as React from 'react';
import {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent
} from 'react';
import { useRouter } from "next/navigation";

interface Params {
  name: string;
}
interface DeletePageParams {
  params: Promise<Params>;
}

export default function DeletePage({ params }: DeletePageParams) {
  const [inputText, setInputText] = useState("");
  const [validInput, setValidInput] = useState(false);
  const { name } = React.use(params);
  const router = useRouter();

  useEffect(() => {
    const isValidInput = inputText === name;
    setValidInput(isValidInput);
  }, [inputText, name])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputText(value);
    console.log(inputText);
  }

  const handleDelete = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('deleted');
  }

  return (
    <>
      <h1>{name}</h1>
      <p><strong>By submitting the following form, this instance will be permanently deleted</strong></p>
      <form action="" method="get" onSubmit={(e) => handleDelete(e)}>
        <label htmlFor='instance'>Type the instance name:</label>
        <input type="text" name="instance" onChange={(e) => handleChange(e)} />
        <button type="submit" disabled={!validInput}>Delete</button>
        <button type="button" onClick={() => router.push(`/instances/${name}`)}>Cancel</button>
      </form >
    </>
  )
}
