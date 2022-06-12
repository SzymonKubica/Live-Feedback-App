import ChakraProvider from "@chakra-ui/react"
import React, { useState, useEffect } from "react"

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react"

export const SnapshotView = () => {
  // const [snapshots, setSnapshots] = useState({});
  const [tableBody, setTableBody] = useState(<Tbody></Tbody>)

  useEffect(() => {
    fetch("/api/snapshots")
      .then(res => res.json())
      .then(data => {
        // setSnapshots(data.snapshots);
        setTableBody(
          <Tbody>
            {Object.keys(data.snapshots).map(key => {
              console.log(key)
              return (
                <Tr key={key}>
                  <Td>{JSON.stringify(data.snapshots[key].start)}</Td>
                  <Td>{JSON.stringify(data.snapshots[key].end)}</Td>
                  <Td>{data.snapshots[key].summarised_data.confused}</Td>
                  <Td>{data.snapshots[key].summarised_data.good}</Td>
                  <Td>{data.snapshots[key].summarised_data["too-fast"]}</Td>
                  <Td>{data.snapshots[key].summarised_data.chilling}</Td>
                </Tr>
              )
            })}
          </Tbody>
        )
      })
  }, [])

  return (
    <ChakraProvider>
      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Start</Th>
              <Th>End</Th>
              <Th>Confused</Th>
              <Th>Good</Th>
              <Th>Too Fast</Th>
              <Th>Chilling</Th>
            </Tr>
          </Thead>
          {tableBody}
        </Table>
      </TableContainer>
    </ChakraProvider>
  )
}
