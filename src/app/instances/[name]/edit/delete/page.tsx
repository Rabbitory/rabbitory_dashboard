"use client"

import * as React from 'react';

interface Params {
  name: string;
}
interface DeletePageParams {
  params: Promise<Params>;
}

export default function DeletePage({ params }: DeletePageParams) {
  const { name } = React.use(params);
  return (
    <>
      <h1>{name}</h1>
      <p><strong>By submitting the following form, this instance will be permanently deleted</strong></p>
      <form action="" method="get">
        <label htmlFor='instance'>Type the instance name:</label>
        <input type="text" name="instance" />
        <input type="submit" value="Delete" />
        <button type="button" >Cancel</button>
      </form>
    </>
  )
}
