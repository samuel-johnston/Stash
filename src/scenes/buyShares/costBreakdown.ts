import { Dispatch, SetStateAction, useEffect } from "react";
import { BuySharesFormValues } from "./index";
import { useFormikContext } from "formik";

interface Props {
  gstPercent: string;
  setShareValue: Dispatch<SetStateAction<number>>;
  setBrokerage: Dispatch<SetStateAction<number>>;
  setGst: Dispatch<SetStateAction<number>>;
  setTotal: Dispatch<SetStateAction<number>>;
}

// Updates the cost breakdown values with the form values
const CostBreakdownHandler = (props: Props): null => {
  const { gstPercent, setShareValue, setBrokerage, setGst, setTotal } = props;
  const { values } = useFormikContext<BuySharesFormValues>();

  useEffect(() => {
    let total = 0;

    // If quantity or unit cost is empty, then set share vlaue to default $0.00
    if (values.quantity === "" || values.unitCost === "") {
      setShareValue(0);
    }
    // Otherwise update the share value
    else {
      const shareValue = parseFloat(values.quantity) * parseFloat(values.unitCost);
      setShareValue(shareValue);
      total += shareValue;
    }

    // If brokerage is empty, then set brokerage and gst to default $0.00
    if (values.brokerage === "") {
      setBrokerage(0);
      setGst(0);
    }
    // Otherwise update the brokerage and gst
    else {
      const brokerage = parseFloat(values.brokerage);
      const gst = brokerage * (parseFloat(gstPercent) / 100);
      setBrokerage(brokerage);
      setGst(gst);
      total += brokerage + gst;
    }

    // Update the total
    setTotal(total);
  }, [values, gstPercent]);

  return null;
};

export default CostBreakdownHandler;
