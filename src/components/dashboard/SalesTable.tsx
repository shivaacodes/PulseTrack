  <TableCell className="font-medium">{row.page}</TableCell>
  <TableCell className="text-right tabular-nums">{(row.visitors || 0).toLocaleString()}</TableCell>
  <TableCell className="text-right tabular-nums">{row.bounceRate}</TableCell>
  <TableCell className="text-right tabular-nums">{row.conversion}</TableCell> 