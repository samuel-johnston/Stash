import { Dispatch, SetStateAction } from "react";
import { enqueueSnackbar } from "notistack";
import { Form, Formik } from "formik";
import * as yup from "yup";

// Material UI
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";

// Types
import { Account } from "../../../electron/types";

interface Props {
  accountsList: Account[];
  newAccountId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setAccountsList: Dispatch<SetStateAction<Account[]>>;
}

interface AddAccountFormValues {
  name: string;
  accountId: string;
}

const AddAccountDialog = (props: Props) => {
  const {
    accountsList,
    newAccountId,
    open,
    setOpen,
    setAccountsList,
  } = props;

  const initialValues: AddAccountFormValues = {
    name: "",
    accountId: newAccountId,
  };

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .test("not-existing", "Name already exists", (value) => !accountsList.some((account) => account.name === value))
      .required("Name can't be empty"),
  });

  const handleSubmit = async (values: AddAccountFormValues) => {
    const updatedAccountsList = await window.electronAPI.createAccount(values.name, values.accountId);
    setAccountsList(updatedAccountsList);
    // Close dialog
    setOpen(false);
    // Show snackbar
    enqueueSnackbar(`${values.name} successfully created!`, { variant: "success" });
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={() => setOpen(false)}>
      <DialogTitle variant="h4" fontWeight={600} sx={{ paddingBottom: "0px" }}>
        Add New Account
      </DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, touched, errors }) => (
          <Form>
            <DialogContent sx={{ pt: "10px", pb: "0px" }}>
              {/* Account name field */}
              <Typography variant="h5" fontWeight={500} mt="14px">
                Name
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="name"
                placeholder="Account Name"
                value={values.name}
                onChange={handleChange}
                sx={{ mt: "8px", ml: "-2px" }}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
              {/* Account id field */}
              <Typography variant="h5" fontWeight={500} mt="20px">
                Account ID
              </Typography>
              <TextField
                disabled
                fullWidth
                size="small"
                name="accountId"
                value={values.accountId}
                sx={{ mt: "8px", ml: "-2px" }}
              />
              <Typography fontSize={14} fontWeight={400} mt="6px" color="secondary">
                This is the generated ID that will be assigned to your new account.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ pt: "4px" }}>
              <Button variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained">Save</Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddAccountDialog;
