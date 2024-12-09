import { useEffect, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";

// Helper files
import LoadSettings from "./loadSettings";
import RowLabel from "./rowLabel";

// Material UI
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";

// Components
import NumericTextField from "../../components/numericTextField";
import Header from "../../components/header";

// Types
import { Settings } from "../../../electron/types";
import { enqueueSnackbar } from "notistack";

const Settings = () => {
  const [storagePath, setStoragePath] = useState<string>("");

  // On page render, get data from API
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const path = await window.electronAPI.getStoragePath();
      if (isMounted) setStoragePath(path);
    })();
    // Clean up
    return () => {
      isMounted = false;
    };
  }, []);

  const initialValues: Settings = {
    unitPriceAutoFill: true,
    gstPercent: "",
    brokerageAutoFill: "",
  };

  const validationSchema = () =>
    yup.object().shape({
      gstPercent: yup.number().typeError("Invalid Type").required("Required"),
    });

  return (
    <Box m="25px 30px 15px 30px">
      <Formik
        onSubmit={async (values: Settings) => {
          await window.electronAPI.setData("settings", values);
          enqueueSnackbar("Successfully saved!", { variant: "success" });
        }}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            {/* Load settings from storage */}
            <LoadSettings />
            <Header title="Settings" subtitle="Manage application settings" />
            {/* STORAGE */}
            <Typography variant="h4" m="0px 0px 10px 0px">
              Storage
            </Typography>
            <Divider />
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              m="12px 6px 0px 0px"
            >
              {/* Left Side */}
              <RowLabel title="Storage Location" subtitle={storagePath} />
              {/* Right Side */}
              <Box>
                <Button
                  variant="outlined"
                  onClick={() => window.electronAPI.openStoragePath()}
                  sx={{ width: 130 }}
                >
                  Open Location
                </Button>
              </Box>
            </Box>
            {/* BUY SHARES */}
            <Typography variant="h4" m="30px 0px 10px 0px">
              Buy Shares
            </Typography>
            <Divider />
            {/* UNIT COST AUTO FILL */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              m="12px 6px 0px 0px"
            >
              {/* Left Side */}
              <RowLabel
                title="Unit Price Auto Fill"
                subtitle="Automatically prefill forms using the current share price"
              />
              {/* Right Side */}
              <Switch
                name="unitPriceAutoFill"
                checked={values.unitPriceAutoFill}
                onChange={handleChange}
                inputProps={{ "aria-label": "controlled" }}
              />
            </Box>
            {/* GST PERCENT */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              m="12px 6px 0px 0px"
            >
              {/* Left Side */}
              <RowLabel
                title="GST Percentage"
                subtitle="% of brokerage used to calculate GST"
              />
              {/* Right Side */}
              <NumericTextField
                adornment="percent"
                name="gstPercent"
                size="small"
                value={values.gstPercent}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.gstPercent && !!errors.gstPercent}
                sx={{ width: 130 }}
              />
            </Box>
            {/* BROKERAGE AUTO FILL */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              m="12px 6px 0px 0px"
            >
              {/* Left Side */}
              <RowLabel
                title="Brokerage Auto Fill"
                subtitle="Automatically prefill forms with this brokerage"
              />
              {/* Right Side */}
              <NumericTextField
                adornment="currency"
                name="brokerageAutoFill"
                size="small"
                value={values.brokerageAutoFill}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.brokerageAutoFill && !!errors.brokerageAutoFill}
                sx={{ width: 130 }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px" mr="6px">
              <Button type="submit" variant="contained" sx={{ width: 130 }}>
                Save Changes
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Settings;
