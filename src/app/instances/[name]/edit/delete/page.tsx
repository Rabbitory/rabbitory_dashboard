"use client"

import * as React from 'react';
import {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent
} from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios';
import Instance from '@/types/instance';

interface Params {
  name: string;
}
interface DeletePageParams {
  params: Promise<Params>;
}

const instance = await axios.get(`/api/instances/${name}`);

export default function DeletePage({ params }: DeletePageParams) {
  const { name } = React.use(params);
  const [inputText, setInputText] = useState("");
  const [validInput, setValidInput] = useState(false);
  const [instance, setInstance] = useState<Instance | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchInstance = async () => {
      try {
        const response = await axios.get(`/api/instances/${name}`);
        setInstance(response.data);
      } catch (error) {
        console.error("Error fetching instance:", error);
      }
    };

    fetchInstance();
  }, [name]);

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
    try {
      // deleteInstanceByName(name);
    } catch (err) {
      console.error("Error deleting instance:", err);
    }
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
