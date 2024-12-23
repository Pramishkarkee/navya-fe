import React from "react";
import {
  Card,
  Input,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";

const formatNumber = (
  value,
  minimumFractionDigits = 2,
  maximumFractionDigits = 2
) => {
  if (!value) return "0.00";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(parseFloat(value));
};

const DynamicTransactionTable = ({
  isEditing = false,
  data = {},
  onFieldChange = (field, value) => {},
  fieldConfig = [],
}) => {
  const renderTableCell = (field) => {
    const value = data[field.key];

    if (field.readOnly) {
      return (
        <TableCell className={field.cellClassName}>
          {field.format === "capitalize"
            ? value?.toString().toLowerCase()
            : field.format === "number"
            ? formatNumber(value)
            : value || "0.00"}
        </TableCell>
      );
    }

    return (
      <TableCell>
        {isEditing ? (
          <Input
            value={value || ""}
            onChange={(e) => onFieldChange(field.key, e.target.value)}
            className="w-full"
            type={field.type || "text"}
          />
        ) : (
          formatNumber(value)
        )}
      </TableCell>
    );
  };

  const renderRows = () => {
    const rows = [];
    for (let i = 0; i < fieldConfig.length; i += 3) {
      const rowFields = fieldConfig.slice(i, i + 3);
      rows.push(
        <TableRow key={i}>
          {rowFields.map((field, index) => (
            <React.Fragment key={field.key}>
              <TableCell className="font-medium">{field.label}</TableCell>
              {renderTableCell(field)}
            </React.Fragment>
          ))}
        </TableRow>
      );
    }
    return rows;
  };

  return (
    <Card className="w-full">
      <Table>
        <TableBody>{renderRows()}</TableBody>
      </Table>
    </Card>
  );
};

export default DynamicTransactionTable;
