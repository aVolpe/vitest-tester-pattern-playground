import { useForm, SubmitHandler } from "react-hook-form"


type Inputs = {
  lastname: string
  firstname: string
}

export function Step2Form(props: {
    onSubmit: (dat: Inputs) => void
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = (data) => props.onSubmit(data); 

    return <form onSubmit={handleSubmit(onSubmit)}>

        <input {...register("firstname", { required: true, maxLength: 10 })} data-testid="firstname-input"/>
        {errors.firstname 
            ? <span>This field is invalid</span>
            : <span>The firstname is valid</span>
        }

        <input {...register("lastname", { maxLength: 20 })} data-testid="lastname-input"/>

        <span>The form has {Object.keys(errors).length} errors</span>
        <input type="submit" data-testid="step2-button" value="Save" />
    </form>

}
