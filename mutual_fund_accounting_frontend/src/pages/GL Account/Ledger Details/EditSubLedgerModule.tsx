import React, { useEffect, useState } from "react";
import { Modal, Box, TextField, Autocomplete } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import CloseIcon from "@mui/icons-material/Close";
import { usePatchSubLedgerHead } from "services/SubLedgerHeadServices";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import RoundedButton from "components/Button/Button";
import { useGetAllLedgerHeadList } from "services/SubLedgerHeadServices";

interface EditModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: any;
  onSave: (updatedData: any) => void;
}

const EditSubLedgerModal: React.FC<EditModalProps> = ({
  open,
  setOpen,
  data,
  onSave,
}) => {
  // const theme = useTheme();

  const [successabarOpen, setSuccessbarOpen] = useState<boolean>();
  const [errorsbarOpen, setErrorbarOpen] = useState<boolean>();
  const [accHeadOptions, setAccHeadOptions] = useState<
    { label: string; ledger_head_id: number }[]
  >([]);

  const { mutate: dataMutualSetup } = usePatchSubLedgerHead(data.id);

  const schema = yup
    .object({
      sub_ledger_head: yup.string().required("Sub Ledger Head is Required"),
      sub_ledger_description: yup
        .string()
        .required("Sub Ledger Description is Required"),
    })
    .required();

  const {
    control,
    handleSubmit,
    formState: { errors },
    // watch,
    // reset
    // setValue,
  } = useForm({
    resolver: yupResolver<any>(schema),
    defaultValues: {
      // ledger_head: data?.ledger_head,
      ledger_head: data?.ledger_head,
      sub_ledger_head: data?.sub_ledger_head,
      sub_ledger_description: data?.sub_ledger_description,
    },
  });

  const {
    data: AccHeadData,
    // isFetching: accHeadFetching,
  } = useGetAllLedgerHeadList();

  useEffect(() => {
    if (AccHeadData?.isSuccess) {
      setAccHeadOptions(
        AccHeadData?.responseData?.map((item) => ({
          label: item.ledger_head,
          ledger_head_id: item.id,
        }))
      );
    }
  }, [AccHeadData]);

  const handleSave = (data) => {
    const ledger_id = accHeadOptions.find(
      (option) => option.label === data.ledger_head
    )?.ledger_head_id;

    const payload = {
      ledger_head: ledger_id,
      sub_ledger_head: data.sub_ledger_head,
      sub_ledger_description: data.sub_ledger_description,
    };

    dataMutualSetup(payload, {
      onSuccess: () => {
        setOpen(false);
        setSuccessbarOpen(true);
        // reset(data);
      },
      onError: (error) => {
        setErrorbarOpen(true);
      },
    });
    onSave(payload);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    // reset(data);
  };

  // const schemeType = watch("scheme_type");

  return (
    <>
      <SuccessBar
        snackbarOpen={successabarOpen}
        message={"Sub-Ledger Head Successfully Updated!"}
        setSnackbarOpen={setSuccessbarOpen}
      />
      <ErrorBar
        snackbarOpen={errorsbarOpen}
        message={"Error in Updating Sub-Ledger Head!"}
        setSnackbarOpen={setErrorbarOpen}
      />

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            // width: 600,
            bgcolor: "background.paper",
            border: "none",
            borderRadius: 5,
            width: "50%",
            // boxShadow: 24,
            p: 5,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <HeaderDesc title="Edit Sub-Ledger Head" />
            <CloseIcon sx={{ cursor: "pointer" }} onClick={handleClose} />
          </Box>

          <Box
            component="form"
            sx={{ mt: 0 }}
            onSubmit={handleSubmit(handleSave)}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(1 , 1fr)",
                gap: 3,
                width: "100%",
                mb: 2,
              }}
            >
              <Box sx={{ width: "100%" }}>
                <TypographyLabel title="Ledger Head" />

                <Controller
                  name="ledger_head"
                  control={control}
                  defaultValue={data.ledger_head}
                  render={({ field }) => (
                    <Autocomplete
                      sx={{
                        width: "100%",
                      }}
                      size="small"
                      options={accHeadOptions}
                      getOptionLabel={(option) => option.label}
                      isOptionEqualToValue={(option, value) => {
                        return option.ledger_head_id === value.ledger_head_id;
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select Ledger Head Name"
                        />
                      )}
                      value={
                        accHeadOptions.find((option) => {
                          return option.label === field.value;
                        }) || null
                      }
                      onChange={(event, value) =>
                        field.onChange(value ? value.label : "")
                      }
                    />
                  )}
                />
              </Box>

              <Box sx={{ width: "100%", mt: 1 }}>
                <TypographyLabel title={"Sub Ledger Head"} />
                <Controller
                  name="sub_ledger_head"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      sx={{ margin: 0, width: "100%" }}
                      size="small"
                      placeholder="Navya Large Cap Fund"
                      error={!!errors.sub_ledger_head}
                      //   helperText={errors.sub_ledger_head?.message}
                    />
                  )}
                />
              </Box>

              <Box sx={{ width: "100%", mt: 1 }}>
                <TypographyLabel title={"Sub Ledger Description"} />
                <Controller
                  name="sub_ledger_description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      sx={{ margin: 0, width: "100%" }}
                      size="small"
                      placeholder=""
                      error={!!errors.sub_ledger_description}
                      //   helperText={errors.sub_ledger_description?.message}
                    />
                  )}
                />
              </Box>
            </Box>
            <Box sx={{ mt: 1 }}>
              <RoundedButton title1="Update Record" />
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default EditSubLedgerModal;
